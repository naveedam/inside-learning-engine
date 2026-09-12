/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";

export interface VoiceCacheEntry {
  url: string;
  blob: Blob;
}

/**
 * Convert base64 data string to an Audio Blob.
 * If the data is raw PCM, wraps with a 44-byte RIFF/WAV header.
 */
function base64ToAudioBlob(base64Data: string, mimeType: string): Blob {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // If already WAV, MP3, or OGG
  if (
    mimeType.includes("wav") ||
    mimeType.includes("mp3") ||
    mimeType.includes("mpeg") ||
    mimeType.includes("ogg") ||
    (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) // RIFF
  ) {
    return new Blob([bytes], { type: mimeType || "audio/wav" });
  }

  // Otherwise assume raw 16-bit PCM little-endian (e.g. 24000 Hz, 1 channel)
  const rateMatch = mimeType.match(/rate=(\d+)/i);
  const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
  const numChannels = 1;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const totalDataLen = bytes.length;
  const totalFileLen = totalDataLen + 36;

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, totalFileLen, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, totalDataLen, true);

  return new Blob([header, bytes], { type: "audio/wav" });
}

class VoiceEngine {
  // Opt-in feature: default to OFF
  private enabled: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private activeRequestId: number = 0;
  private isSpeakingState: boolean = false;
  private currentSpokenText: string = "";

  // In-memory session cache: key is `${mentorId}::${cleanText}`
  private cache: Map<string, VoiceCacheEntry> = new Map();

  // Subscriptions for React UI updates
  private speakingListeners: Set<(isSpeaking: boolean, text: string) => void> = new Set();
  private enabledListeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    // Check initial server availability if needed
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!this.enabled) {
      this.stop();
    }
    this.notifyEnabled();
  }

  public toggleEnabled(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getCurrentText(): string {
    return this.currentSpokenText;
  }

  /**
   * Immediately cancel any running audio playback and release listeners.
   */
  public stop() {
    this.activeRequestId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = "";
      } catch (err) {
        // ignore
      }
      this.currentAudio = null;
    }
    this.isSpeakingState = false;
    this.currentSpokenText = "";
    this.notifySpeaking();
  }

  /**
   * Synthesize and play dialogue for a mentor.
   * - Non-blocking: returns immediately while audio streams / plays in background.
   * - Cancels previous playback so mentors never talk over each other.
   * - Checks cache first before making network call.
   * - Falls back silently to text-only if network or TTS fails.
   */
  public speak(text: string, mentorId: string = "GALILEO"): void {
    // If feature is disabled by student, do nothing
    if (!this.enabled) return;
    this.playLine(text, mentorId, false);
  }

  /**
   * Replay a line of dialogue on-demand even if auto-narration is off.
   */
  public replay(text: string, mentorId: string = "GALILEO"): void {
    this.playLine(text, mentorId, true);
  }

  private async playLine(text: string, mentorId: string, forcePlay: boolean) {
    if (!text || !text.trim()) return;

    // Stop any existing playback
    this.stop();

    const requestId = ++this.activeRequestId;
    const cleanKey = `${mentorId.toUpperCase()}::${text.trim()}`;

    // 1. Check in-memory session cache
    const cached = this.cache.get(cleanKey);
    if (cached) {
      this.playAudioUrl(cached.url, text, requestId);
      return;
    }

    // 2. Fetch from Gemini TTS backend
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mentorId })
      });

      if (!res.ok) {
        // Silent graceful fallback
        return;
      }

      const data = await res.json();

      // Check if another request superseded this one while waiting
      if (this.activeRequestId !== requestId) {
        return;
      }

      // Check if disabled while fetching (unless student explicitly pressed replay)
      if (!this.enabled && !forcePlay) {
        return;
      }

      if (data.audio) {
        const blob = base64ToAudioBlob(data.audio, data.mimeType || "audio/wav");
        const url = URL.createObjectURL(blob);

        // Store in session cache
        this.cache.set(cleanKey, { url, blob });

        this.playAudioUrl(url, text, requestId);
      }
    } catch (err) {
      // Graceful silent fallback to text-only: learning flow never halts
      console.warn("Mentor voice uplink unavailable, continuing in text mode.");
    }
  }

  private playAudioUrl(url: string, text: string, requestId: number) {
    if (this.activeRequestId !== requestId) return;

    try {
      const audio = new Audio(url);
      this.currentAudio = audio;
      this.currentSpokenText = text;

      audio.onplay = () => {
        if (this.activeRequestId === requestId) {
          this.isSpeakingState = true;
          this.notifySpeaking();
        }
      };

      audio.onended = () => {
        if (this.activeRequestId === requestId) {
          this.isSpeakingState = false;
          this.currentSpokenText = "";
          this.currentAudio = null;
          this.notifySpeaking();
        }
      };

      audio.onerror = () => {
        if (this.activeRequestId === requestId) {
          this.isSpeakingState = false;
          this.currentSpokenText = "";
          this.currentAudio = null;
          this.notifySpeaking();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled silently if browser autoplay requires user gesture
          if (this.activeRequestId === requestId) {
            this.isSpeakingState = false;
            this.notifySpeaking();
          }
        });
      }
    } catch (err) {
      this.isSpeakingState = false;
      this.notifySpeaking();
    }
  }

  // --- Subscriptions ---
  public subscribe(fn: (isSpeaking: boolean, text: string) => void): () => void {
    this.speakingListeners.add(fn);
    return () => this.speakingListeners.delete(fn);
  }

  public subscribeEnabled(fn: (enabled: boolean) => void): () => void {
    this.enabledListeners.add(fn);
    return () => this.enabledListeners.delete(fn);
  }

  private notifySpeaking() {
    this.speakingListeners.forEach((fn) => fn(this.isSpeakingState, this.currentSpokenText));
  }

  private notifyEnabled() {
    this.enabledListeners.forEach((fn) => fn(this.enabled));
  }
}

export const voiceEngine = new VoiceEngine();
export default voiceEngine;

/**
 * React Hook for consuming voice state in cockpit components
 */
export function useMentorVoice() {
  const [enabled, setEnabled] = useState(voiceEngine.getEnabled());
  const [isSpeaking, setIsSpeaking] = useState(voiceEngine.isSpeaking());
  const [speakingText, setSpeakingText] = useState(voiceEngine.getCurrentText());

  useEffect(() => {
    const unsubEnabled = voiceEngine.subscribeEnabled((val) => setEnabled(val));
    const unsubSpeaking = voiceEngine.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      setSpeakingText(text);
    });
    return () => {
      unsubEnabled();
      unsubSpeaking();
    };
  }, []);

  return {
    enabled,
    isSpeaking,
    speakingText,
    toggleVoice: () => voiceEngine.toggleEnabled(),
    setVoiceEnabled: (val: boolean) => voiceEngine.setEnabled(val),
    stopVoice: () => voiceEngine.stop(),
    speak: (text: string, mentorId?: string) => voiceEngine.speak(text, mentorId),
    replay: (text: string, mentorId?: string) => voiceEngine.replay(text, mentorId)
  };
}
