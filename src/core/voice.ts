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

interface VoiceQueueItem {
  id: number;
  text: string;
  mentorId: string;
  cleanKey: string;
  isManualTrigger: boolean;
  status: "fetching" | "ready" | "playing" | "discarded";
  url?: string;
}

class VoiceEngine {
  // Opt-in feature: default to OFF
  private enabled: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private currentlyPlaying: VoiceQueueItem | null = null;
  private pendingQueue: VoiceQueueItem[] = [];
  private queueSeq: number = 0;
  private isSpeakingState: boolean = false;
  private currentSpokenText: string = "";

  // In-memory session cache: key is `${mentorId}::${cleanText}`
  private cache: Map<string, VoiceCacheEntry> = new Map();

  // One-time session tracking for autoplay notice
  private hasShownAutoplayNotice: boolean = false;
  private noticeElement: HTMLElement | null = null;
  private noticeTimeout: ReturnType<typeof setTimeout> | null = null;

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
   * Immediately cancel any running audio playback, empty the queue, and release listeners.
   */
  public stop() {
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

    for (const item of this.pendingQueue) {
      item.status = "discarded";
    }
    this.pendingQueue = [];
    this.currentlyPlaying = null;
    this.isSpeakingState = false;
    this.currentSpokenText = "";
    this.notifySpeaking();
  }

  /**
   * Discard non-manual items if autoplay was blocked by browser policy.
   */
  private clearPendingAutoItems() {
    for (const item of this.pendingQueue) {
      if (!item.isManualTrigger) {
        item.status = "discarded";
      }
    }
    this.pendingQueue = this.pendingQueue.filter((i) => i.isManualTrigger);
  }

  /**
   * Synthesize and queue dialogue for a mentor.
   * - Non-blocking: returns immediately while audio streams / plays in background.
   * - Uses a bounded queue (capped at 2 pending items).
   * - If a 3rd item arrives while 2 are already pending, drops the OLDEST queued item
   *   so playback cannot lag arbitrarily far behind the visible text.
   * - Checks cache first before making network call.
   * - Falls back silently to text-only if network or TTS fails.
   */
  public speak(text: string, mentorId: string = "GALILEO"): void {
    // If feature is disabled by student, do nothing
    if (!this.enabled) return;
    if (!text || !text.trim()) return;

    const cleanKey = `${mentorId.toUpperCase()}::${text.trim()}`;

    // Avoid duplicate queue entries if the identical line is already playing or pending
    if (this.currentlyPlaying?.cleanKey === cleanKey) {
      return;
    }
    if (this.pendingQueue.some((i) => i.cleanKey === cleanKey)) {
      return;
    }

    // Bounded queue: cap at 2 pending items
    // If a third supersedes while 2 are already queued, drop only the OLDEST queued item
    if (this.pendingQueue.length >= 2) {
      const oldest = this.pendingQueue.shift()!;
      oldest.status = "discarded";
    }

    const item: VoiceQueueItem = {
      id: ++this.queueSeq,
      text,
      mentorId,
      cleanKey,
      isManualTrigger: false,
      status: "fetching",
    };

    this.pendingQueue.push(item);
    this.fetchOrLoadItemAudio(item);
  }

  /**
   * Replay a line of dialogue on-demand even if auto-narration is off.
   * Direct student gesture - dismisses any previous autoplay notice.
   * Jumps the queue: immediately interrupts currently-playing audio and clears pending auto items.
   */
  public replay(text: string, mentorId: string = "GALILEO"): void {
    this.dismissAutoplayNotice();
    if (!text || !text.trim()) return;

    // Immediately interrupt currently-playing audio
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
    this.currentlyPlaying = null;
    this.isSpeakingState = false;
    this.currentSpokenText = "";
    this.notifySpeaking();

    // Replay jumps the queue: clear any pending auto-narration items
    for (const item of this.pendingQueue) {
      item.status = "discarded";
    }
    this.pendingQueue = [];

    const cleanKey = `${mentorId.toUpperCase()}::${text.trim()}`;
    const replayItem: VoiceQueueItem = {
      id: ++this.queueSeq,
      text,
      mentorId,
      cleanKey,
      isManualTrigger: true,
      status: "fetching",
    };

    // Fast synchronous cache hit: play immediately inside the user click gesture
    const cached = this.cache.get(cleanKey);
    if (cached) {
      replayItem.url = cached.url;
      replayItem.status = "ready";
      this.playItem(replayItem);
      return;
    }

    // If not cached, enqueue at the front and fetch
    this.pendingQueue.push(replayItem);
    this.fetchOrLoadItemAudio(replayItem);
  }

  private async fetchOrLoadItemAudio(item: VoiceQueueItem) {
    // 1. Check in-memory session cache
    const cached = this.cache.get(item.cleanKey);
    if (cached) {
      item.url = cached.url;
      if (item.status !== "discarded") {
        item.status = "ready";
        this.processQueue();
      }
      return;
    }

    // 2. Fetch from Gemini TTS backend
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text, mentorId: item.mentorId }),
      });

      if (!res.ok) {
        this.handleItemFailed(item);
        return;
      }

      const data = await res.json();

      if (data.audio) {
        const blob = base64ToAudioBlob(data.audio, data.mimeType || "audio/wav");
        const url = URL.createObjectURL(blob);

        // Store in session cache
        this.cache.set(item.cleanKey, { url, blob });
        item.url = url;

        if (item.status !== "discarded") {
          item.status = "ready";
          this.processQueue();
        }
      } else {
        this.handleItemFailed(item);
      }
    } catch (err) {
      // Graceful silent fallback to text-only: learning flow never halts
      this.handleItemFailed(item);
    }
  }

  private handleItemFailed(item: VoiceQueueItem) {
    if (item.status === "discarded") return;
    const idx = this.pendingQueue.indexOf(item);
    if (idx !== -1) {
      this.pendingQueue.splice(idx, 1);
    }
    item.status = "discarded";
    this.processQueue();
  }

  /**
   * Inspect the queue and play the next available item in chronological dialogue order.
   */
  private processQueue() {
    // If currently playing something, wait for onended
    if (this.currentlyPlaying) {
      return;
    }

    // If disabled and not a manual replay, clear auto items
    if (!this.enabled) {
      this.pendingQueue = this.pendingQueue.filter((i) => i.isManualTrigger);
      if (this.pendingQueue.length === 0) return;
    }

    if (this.pendingQueue.length === 0) {
      return;
    }

    // Examine the oldest pending item in chronological order
    const nextItem = this.pendingQueue[0];

    // If ready, dequeue and play
    if (nextItem.status === "ready" && nextItem.url) {
      this.pendingQueue.shift();
      this.playItem(nextItem);
    }
    // If nextItem is still 'fetching', we preserve chronological dialogue order and wait for it
  }

  private playItem(item: VoiceQueueItem) {
    if (!item.url) return;

    try {
      const audio = new Audio(item.url);
      this.currentAudio = audio;
      this.currentlyPlaying = item;
      item.status = "playing";
      this.currentSpokenText = item.text;

      audio.onplay = () => {
        if (this.currentlyPlaying === item) {
          this.isSpeakingState = true;
          this.notifySpeaking();
          this.dismissAutoplayNotice();
        }
      };

      audio.onended = () => {
        if (this.currentlyPlaying === item) {
          this.isSpeakingState = false;
          this.currentSpokenText = "";
          this.currentAudio = null;
          this.currentlyPlaying = null;
          this.notifySpeaking();
          this.processQueue();
        }
      };

      audio.onerror = () => {
        console.warn("Audio playback error on item:", item.text);
        if (this.currentlyPlaying === item) {
          this.isSpeakingState = false;
          this.currentSpokenText = "";
          this.currentAudio = null;
          this.currentlyPlaying = null;
          this.notifySpeaking();
          this.processQueue();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: any) => {
          // Explicitly distinguish audio.play() rejection (autoplay blocked) from network/fetch failures
          console.warn("Autoplay blocked by browser - user must manually trigger playback:", err?.message || err);

          if (this.currentlyPlaying === item) {
            this.isSpeakingState = false;
            this.currentSpokenText = "";
            this.currentAudio = null;
            this.currentlyPlaying = null;
            this.notifySpeaking();
          }

          if (!item.isManualTrigger) {
            this.showAutoplayNotice();
            this.clearPendingAutoItems();
          }
        });
      }
    } catch (err: any) {
      console.warn("Audio playback initialization error:", err?.message || err);
      this.isSpeakingState = false;
      this.currentSpokenText = "";
      this.currentAudio = null;
      this.currentlyPlaying = null;
      this.notifySpeaking();
      this.processQueue();
    }
  }

  /**
   * Surface a small, dismissible one-time HUD notice when browser blocks autoplay,
   * suggesting the student tap the speaker icon next to a mentor's message.
   */
  private showAutoplayNotice() {
    if (typeof document === "undefined" || this.hasShownAutoplayNotice) {
      return;
    }

    try {
      if (sessionStorage.getItem("voice_autoplay_notice_shown") === "true") {
        this.hasShownAutoplayNotice = true;
        return;
      }
      sessionStorage.setItem("voice_autoplay_notice_shown", "true");
    } catch {
      // Ignore sessionStorage restrictions if cookies/storage are disabled
    }

    this.hasShownAutoplayNotice = true;
    this.dismissAutoplayNotice();

    const noticeId = "mentor-voice-autoplay-notice";
    const existing = document.getElementById(noticeId);
    if (existing) {
      existing.remove();
    }

    const container = document.createElement("div");
    container.id = noticeId;
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");

    // Non-blocking, compact sci-fi HUD styling
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      max-width: 360px;
      z-index: 9999;
      background: rgba(10, 15, 29, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(6, 182, 212, 0.35);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(6, 182, 212, 0.15);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #e2e8f0;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.25s ease-out, transform 0.25s ease-out;
      pointer-events: auto;
    `;

    container.innerHTML = `
      <div style="flex-shrink: 0; margin-top: 2px; color: #22d3ee;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 2px;">
          Enable Voice Narration
        </div>
        <div style="font-size: 12px; color: #94a3b8; line-height: 1.4;">
          Tap the <span style="color: #38bdf8; font-weight: 600;">speaker icon (🔊)</span> next to any mentor message to hear voice transmissions.
        </div>
      </div>
      <button
        id="dismiss-voice-notice"
        aria-label="Dismiss notice"
        style="
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 2px 4px;
          margin-top: -2px;
          margin-right: -4px;
          font-size: 14px;
          line-height: 1;
          border-radius: 4px;
          transition: color 0.15s;
        "
      >✕</button>
    `;

    document.body.appendChild(container);
    this.noticeElement = container;

    // Trigger enter transition
    requestAnimationFrame(() => {
      container.style.opacity = "1";
      container.style.transform = "translateY(0)";
    });

    const closeBtn = container.querySelector("#dismiss-voice-notice");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dismissAutoplayNotice();
      });
      closeBtn.addEventListener("mouseenter", () => {
        (closeBtn as HTMLElement).style.color = "#f8fafc";
      });
      closeBtn.addEventListener("mouseleave", () => {
        (closeBtn as HTMLElement).style.color = "#64748b";
      });
    }

    // Auto-dismiss after 12 seconds
    this.noticeTimeout = setTimeout(() => {
      this.dismissAutoplayNotice();
    }, 12000);
  }

  public dismissAutoplayNotice() {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
      this.noticeTimeout = null;
    }
    if (this.noticeElement) {
      const el = this.noticeElement;
      this.noticeElement = null;
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 250);
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
