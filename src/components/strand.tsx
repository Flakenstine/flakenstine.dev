"use client";

import { useEffect, useRef } from "react";
import { pluck } from "@/lib/sound";
import { cn } from "@/lib/utils";

const NODES = 72;
const HEIGHT = 80;
const MID = HEIGHT / 2;

type StrandProps = {
  /** Concert pitch, for when sound is on. */
  note?: number;
  className?: string;
};

/**
 * A divider that is a string. Drag the pointer across it and it rings: each
 * node is pulled toward its neighbors, which is the wave equation, stepped.
 */
export function Strand({ note = 220, className }: StrandProps) {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = root.current!;
    const y = new Float32Array(NODES);
    const v = new Float32Array(NODES);
    const cleanup = new AbortController();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let near = false;
    let previous: { x: number; y: number } | undefined;
    let lastNote = 0;

    const draw = (width: number) => {
      const step = width / (NODES - 1);
      let d = `M0 ${MID}`;
      for (let i = 1; i < NODES - 1; i++) {
        const x = i * step;
        const to = (y[i] + y[i + 1]) / 2;
        d += `Q${x.toFixed(1)} ${(MID + y[i]).toFixed(2)} ${(x + step / 2).toFixed(1)} ${(MID + to).toFixed(2)}`;
      }
      path.current?.setAttribute("d", `${d}L${width} ${MID}`);
    };

    const tick = () => {
      frame = 0;
      for (let pass = 0; pass < 4; pass++) {
        for (let i = 1; i < NODES - 1; i++) {
          v[i] = (v[i] + (y[i - 1] - 2 * y[i] + y[i + 1]) * 0.42) * 0.9955;
        }
        for (let i = 1; i < NODES - 1; i++) y[i] += v[i];
      }
      let energy = 0;
      for (let i = 1; i < NODES - 1; i++) {
        energy = Math.max(energy, Math.abs(y[i]), Math.abs(v[i]));
      }
      const moving = energy > 0.05;
      if (!moving) {
        y.fill(0);
        v.fill(0);
      }
      el.style.setProperty("--ring", Math.min(1, energy / 10).toFixed(3));
      draw(el.clientWidth);
      if (moving) frame = requestAnimationFrame(tick);
    };

    const strike = (x: number, width: number, force: number) => {
      const center = (x / width) * (NODES - 1);
      for (let i = 1; i < NODES - 1; i++) {
        const away = (i - center) / 3.2;
        y[i] += force * Math.exp(-away * away);
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (!near || reduced.matches) return;
        const box = el.getBoundingClientRect();
        const line = box.top + box.height / 2;
        const from = previous;
        previous = { x: event.clientX, y: event.clientY };
        if (!from) return;

        const crossed = (from.y - line) * (event.clientY - line) < 0;
        const inside = event.clientX > box.left && event.clientX < box.right;
        if (!crossed || !inside) return;

        const speed = event.clientY - from.y;
        const force = Math.sign(speed) * Math.min(26, 7 + Math.abs(speed) * 0.5);
        strike(event.clientX - box.left, box.width, force);

        if (event.timeStamp - lastNote > 60) {
          lastNote = event.timeStamp;
          // Nearer an end plays higher, like fretting it.
          const at = Math.abs((event.clientX - box.left) / box.width - 0.5) * 2;
          const step = [0, 3, 5, 7, 10, 12][Math.min(5, Math.floor(at * 6))];
          pluck(note * 2 ** (step / 12), 0.08 + Math.abs(force) / 160);
        }
      },
      { passive: true, signal: cleanup.signal },
    );

    const seen = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      previous = undefined;
    });
    seen.observe(el);
    const sized = new ResizeObserver(() => draw(el.clientWidth));
    sized.observe(el);

    return () => {
      cleanup.abort();
      seen.disconnect();
      sized.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [note]);

  return (
    <div ref={root} aria-hidden="true" className={cn("strand", className)}>
      <svg width="100%" height={HEIGHT} className="block overflow-visible">
        {/* Until the string is strung, and without JavaScript. */}
        <line x1="0" x2="100%" y1={MID} y2={MID} stroke="currentColor" />
        <path
          ref={path}
          fill="none"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
