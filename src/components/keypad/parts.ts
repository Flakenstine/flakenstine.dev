"use client";

import { createParts } from "@ui-sdk/react/primitive";
import { keypad } from "./keypad";

export const { Root: Keypad, Key: KeypadKey } = createParts(keypad, {
  root: "div",
  key: "button",
});
