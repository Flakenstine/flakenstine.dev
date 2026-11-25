"use client";

import { Preferences } from "@ui-sdk/react/preferences";
import { phosphor, sound } from "@/lib/preferences";

const preferences = [phosphor, sound];

export function AppPreferences({ children }: { children: React.ReactNode }) {
  return <Preferences preferences={preferences}>{children}</Preferences>;
}
