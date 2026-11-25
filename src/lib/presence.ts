"use client";

import { useSyncExternalStore } from "react";
import type { LanyardData } from "./lanyard";
import { site } from "./site";

/**
 * One live socket to Lanyard, shared by everything that shows presence. It
 * opens with the first subscriber and closes with the last.
 */
export type Presence =
  | { state: "loading" | "error"; data: null }
  | { state: "ready"; data: LanyardData };

const LOADING: Presence = { state: "loading", data: null };

let current: Presence = LOADING;
let socket: WebSocket | undefined;
let heartbeat: ReturnType<typeof setInterval> | undefined;
let retry: ReturnType<typeof setTimeout> | undefined;
let idle: ReturnType<typeof setTimeout> | undefined;
let attempts = 0;
const listeners = new Set<() => void>();

function set(next: Presence) {
  current = next;
  listeners.forEach((listener) => listener());
}

function connect() {
  const ws = new WebSocket("wss://api.lanyard.rest/socket");
  socket = ws;

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data as string) as {
      op: number;
      d: LanyardData & { heartbeat_interval: number };
    };
    if (message.op === 1) {
      ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: site.discordId } }));
      heartbeat = setInterval(
        () => ws.send(JSON.stringify({ op: 3 })),
        message.d.heartbeat_interval,
      );
    } else if (message.op === 0 && message.d?.discord_user) {
      attempts = 0;
      set({ state: "ready", data: message.d });
    }
  };

  ws.onclose = () => {
    clearInterval(heartbeat);
    if (socket !== ws) return;
    attempts += 1;
    if (attempts > 1) set({ state: "error", data: null });
    retry = setTimeout(connect, Math.min(60_000, 1000 * 2 ** attempts));
  };
}

function disconnect() {
  const ws = socket;
  socket = undefined;
  clearTimeout(retry);
  clearInterval(heartbeat);
  ws?.close();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  clearTimeout(idle);
  if (!socket) connect();
  return () => {
    listeners.delete(listener);
    // A moment's grace, so a remount keeps the same socket.
    if (listeners.size === 0) idle = setTimeout(disconnect, 1000);
  };
}

export function usePresence() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => LOADING,
  );
}
