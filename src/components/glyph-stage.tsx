"use client";

import { bindHold } from "@ui-sdk/core";
import { useEffect, useRef, useState } from "react";
import { createGlyphs, type GlyphSource } from "@/lib/glyphs/engine";
import { onShock } from "@/lib/shock";
import { zap } from "@/lib/sound";
import { cn } from "@/lib/utils";

const HOLD = 1100;

type GlyphStageProps = {
  source: GlyphSource;
  /** Names the button that sets it off. */
  label: string;
  hint?: string;
  className?: string;
  /** What shows while the glyphs load, and if they can't. */
  children: React.ReactNode;
};

/**
 * A picture made of glyphs, over the nearest positioned ancestor. Press it for
 * a small shock, or hold it to charge up a big one.
 */
export function GlyphStage({
  source,
  label,
  hint,
  className,
  children,
}: GlyphStageProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [ready, setReady] = useState(false);
  // The source is written inline by its caller, so compare it by content.
  const key = JSON.stringify(source);

  useEffect(() => {
    const target = button.current!;
    const glyphs = createGlyphs({
      canvas: canvas.current!,
      anchor: target,
      source: JSON.parse(key) as GlyphSource,
      onReady: () => setReady(true),
    });
    if (!glyphs) return;

    let pressed = 0;
    const fire = (power: number, at?: { x: number; y: number }) => {
      glyphs.shock(power, at);
      zap(power);
    };

    const unhold = bindHold(target, {
      delay: HOLD,
      tolerance: 24,
      onPress: () => {
        pressed = performance.now();
        glyphs.charge(true);
      },
      onEnd: ({ canceled, event }) => {
        glyphs.charge(false);
        if (canceled) return;
        const held = Math.min(1, (performance.now() - pressed) / HOLD);
        const at =
          event instanceof PointerEvent
            ? { x: event.clientX, y: event.clientY }
            : undefined;
        fire(0.22 + held * 0.95, at);
      },
    });
    const unlisten = onShock((power) => fire(power));

    return () => {
      unhold();
      unlisten();
      glyphs.destroy();
    };
  }, [key]);

  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full font-mono"
      />
      <button
        ref={button}
        type="button"
        aria-label={label}
        data-ready={ready || undefined}
        className={cn(
          "glyph-stage group/stage relative cursor-crosshair touch-pan-y rounded-full outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-phosphor",
          className,
        )}
      >
        <span className="stage-glow" aria-hidden="true" />
        <span className="stage-fallback">{children}</span>
        {hint && (
          <span className="stage-hint" aria-hidden="true">
            <span>{hint}</span>
          </span>
        )}
      </button>
    </>
  );
}
