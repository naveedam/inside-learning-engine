/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EngineEvent, EventCallback } from "../types";

class EventBus {
  private listeners = new Map<string, Set<EventCallback>>();

  public subscribe(eventType: EngineEvent["type"] | "*", callback: EventCallback): () => void {
    const key = eventType;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Return a function to clean up/unsubscribe
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  public publish(event: EngineEvent): void {
    // Notify type-specific subscribers
    this.listeners.get(event.type)?.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error(`Error in event listener for ${event.type}:`, err);
      }
    });
    
    // Notify catch-all ("*") subscribers
    this.listeners.get("*")?.forEach((callback) => {
      try {
        callback(event);
      } catch (err) {
        console.error(`Error in catch-all event listener for ${event.type}:`, err);
      }
    });
  }
}

export const globalEventBus = new EventBus();
export default globalEventBus;
