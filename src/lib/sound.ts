import { sound } from "./preferences";

let context: AudioContext | undefined;

/** Browsers only start audio after a gesture, so this can return nothing. */
function ready() {
  if (sound.get().value !== "on") return;
  if (!navigator.userActivation?.hasBeenActive) return;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

function play(buffer: AudioBuffer, volume: number) {
  const source = context!.createBufferSource();
  source.buffer = buffer;
  const gain = context!.createGain();
  gain.gain.value = volume;
  source.connect(gain).connect(context!.destination);
  source.start();
}

/** A plucked string: Karplus-Strong, a burst of noise in a decaying loop. */
export function pluck(frequency: number, volume = 0.2) {
  const ctx = ready();
  if (!ctx) return;
  const length = Math.floor(ctx.sampleRate * 1.6);
  const period = Math.max(2, Math.round(ctx.sampleRate / frequency));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < period; i++) data[i] = Math.random() * 2 - 1;
  for (let i = period; i < length; i++) {
    data[i] = 0.4975 * (data[i - period] + data[i - period + 1]);
  }
  play(buffer, volume);
}

/** A key bottoming out: a few milliseconds of filtered noise. */
export function clack(pitch = 1) {
  const ctx = ready();
  if (!ctx) return;
  const length = Math.floor(ctx.sampleRate * 0.06);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const t = i / ctx.sampleRate;
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 90);
    last += (noise - last) * 0.45;
    data[i] = last + Math.sin(t * 900 * pitch) * Math.exp(-t * 120) * 0.35;
  }
  play(buffer, 0.35);
}

/** The head letting go: a falling zap. */
export function zap(power: number) {
  const ctx = ready();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(400 + power * 900, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
  gain.gain.setValueAtTime(0.1 * (0.4 + power), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}
