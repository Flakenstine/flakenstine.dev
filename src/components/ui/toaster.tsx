"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastRegion,
  ToastTitle,
} from "@ui-sdk/react/toast";
import { XIcon } from "lucide-react";

export function Toaster() {
  return (
    <ToastRegion side="bottom" align="end">
      {() => (
        <Toast>
          <span className="toast-led" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <ToastTitle className="text-sm font-bold" />
            <ToastDescription className="mt-0.5 text-sm text-muted" />
          </div>
          <ToastClose
            aria-label="Dismiss"
            className="-m-1 rounded p-1 text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-phosphor"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </ToastClose>
        </Toast>
      )}
    </ToastRegion>
  );
}
