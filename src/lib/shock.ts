/** Lets the command palette and the contact form reach the head. */
const EVENT = "flakenstine:shock";

export function shock(power = 1) {
  window.dispatchEvent(new CustomEvent<number>(EVENT, { detail: power }));
}

export function onShock(handler: (power: number) => void) {
  const listener = (event: Event) =>
    handler((event as CustomEvent<number>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
