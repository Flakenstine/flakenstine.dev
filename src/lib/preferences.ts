"use client";

import { createLocalStorage, createPreference } from "@ui-sdk/core";

/** The color the whole site glows in, named after CRT phosphors. */
export const phosphor = createPreference({
  values: ["mint", "amber", "ice"],
  defaultValue: "mint",
  attribute: "data-phosphor",
  global: true,
  storage: createLocalStorage("flakenstine-phosphor"),
});

/** Off unless someone asks: plucked strings and keys make noise. */
export const sound = createPreference({
  values: ["off", "on"],
  defaultValue: "off",
  attribute: "data-sound",
  global: true,
  storage: createLocalStorage("flakenstine-sound"),
});

export const PHOSPHORS = [
  { value: "mint", label: "Mint" },
  { value: "amber", label: "Amber" },
  { value: "ice", label: "Ice" },
] as const;

export type Phosphor = (typeof PHOSPHORS)[number]["value"];
