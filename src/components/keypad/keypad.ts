import {
  createChange,
  createRovingFocus,
  definePrimitive,
  spatialMove,
  type ChangeDetails,
} from "@ui-sdk/core";

export type KeypadOptions = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    value: string,
    details: ChangeDetails<"item-press">,
  ) => void;
};

/**
 * A pad of keys with one tab stop. Arrow keys follow the layout on screen, so
 * the pad can reflow from five columns to three without changing this.
 */
export const keypad = definePrimitive({
  name: "keypad",
  options: {
    value: "string",
    defaultValue: "string",
    onValueChange: "callback",
  },
  controlled: ["value"],
  state: (options: KeypadOptions) => ({
    value: options.value ?? options.defaultValue ?? "",
    focused: null as string | null,
  }),
  sync: (options) =>
    options.value === undefined ? {} : { value: options.value },
  api: (context) => {
    const change = createChange(context);
    const roving = createRovingFocus(context, {
      slot: "key",
      key: "focused",
      move: spatialMove(),
    });

    return {
      roving,
      press: (value: string, event?: Event) =>
        change("value", value, { reason: "item-press", event }),
    };
  },
  slots: (slot) => ({
    root: slot({
      attrs: () => ({ role: "toolbar" }),
    }),
    key: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, part) => ({
        type: "button",
        tabindex: part.api.roving.tabIndex(state, part),
        "data-lit": part.key === state.value ? "" : undefined,
      }),
      press: ({ api, key }, event) => {
        api.press(key, event);
      },
      on: {
        keydown: (event, { el, api }) => {
          if (el) api.roving.keydown(event, el);
        },
      },
      bind: (el, part) => part.api.roving.bind(el, part),
    }),
  }),
});
