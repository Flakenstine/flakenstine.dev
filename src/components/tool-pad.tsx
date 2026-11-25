"use client";

import { useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { Keypad, KeypadKey } from "@/components/keypad/parts";
import { tools } from "@/data/brands";
import { clack } from "@/lib/sound";

/** The tools grid, as a macro pad: a key for each, and a little screen. */
export function ToolPad() {
  const [pressed, setPressed] = useState("");
  const [over, setOver] = useState("");
  const shown = over || pressed;
  const index = tools.findIndex((tool) => tool.name === shown);
  const tool = tools[index] as (typeof tools)[number] | undefined;

  return (
    <div className="pad">
      <div className="pad-screen">
        <div className="pad-readout" key={shown}>
          {tool ? (
            <>
              <BrandIcon icon={tool.icon} className="pad-icon" />
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xl leading-tight font-bold sm:text-2xl">
                  {tool.name}
                </p>
                <p className="text-xs opacity-70 sm:text-sm">{tool.kind}</p>
              </div>
              <p className="absolute top-2.5 right-4 text-xs tabular-nums opacity-70">
                {`${index + 1}`.padStart(2, "0")}/{tools.length}
              </p>
            </>
          ) : (
            <p className="text-sm sm:text-base">
              {tools.length} tools loaded, press a key
              <span className="caret">_</span>
            </p>
          )}
        </div>
      </div>
      <Keypad
        aria-label="Tools"
        value={pressed}
        onValueChange={(value) => {
          setPressed(value);
          clack(1 + tools.findIndex((item) => item.name === value) * 0.05);
        }}
        className="pad-keys"
        onPointerLeave={() => setOver("")}
      >
        {tools.map((item) => (
          <KeypadKey
            key={item.name}
            value={item.name}
            className="pad-key"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setOver(item.name);
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) {
                setPressed(item.name);
              }
            }}
          >
            <span className="pad-cap">
              <BrandIcon icon={item.icon} className="size-6" />
              <span className="pad-legend">{item.name}</span>
            </span>
          </KeypadKey>
        ))}
      </Keypad>
    </div>
  );
}
