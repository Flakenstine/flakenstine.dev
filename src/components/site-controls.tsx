"use client";

import { usePreference } from "@ui-sdk/react/preferences";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { phosphor, PHOSPHORS, sound, type Phosphor } from "@/lib/preferences";
import { pluck } from "@/lib/sound";

/** The color of the glow, and whether the strings make noise. */
export function SiteControls() {
  const glow = usePreference(phosphor).value;
  const noisy = usePreference(sound).value === "on";

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-mono text-xs text-muted">
      <div className="flex items-center gap-3">
        <span aria-hidden="true">phosphor</span>
        <SegmentedControl
          aria-label="Phosphor"
          value={glow}
          onValueChange={(value) => {
            if (value) phosphor.set(value as Phosphor);
          }}
          className="segments"
        >
          <SegmentedControlIndicator className="segments-indicator" />
          {PHOSPHORS.map(({ value, label }) => (
            <SegmentedControlItem key={value} value={value} className="segments-item">
              <span className="swatch" data-phosphor={value} aria-hidden="true" />
              {label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
      <label className="flex cursor-pointer items-center gap-3">
        sound
        <Switch
          aria-label="Sound"
          checked={noisy}
          onCheckedChange={(checked) => {
            sound.set(checked ? "on" : "off");
            if (checked) pluck(330);
          }}
          className="switch"
        >
          <SwitchThumb className="switch-thumb" />
        </Switch>
      </label>
    </div>
  );
}
