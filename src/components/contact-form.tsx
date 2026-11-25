"use client";

import { Button } from "@ui-sdk/react/button";
import { Field, FieldError, FieldLabel } from "@ui-sdk/react/field";
import { Input } from "@ui-sdk/react/input";
import { Textarea } from "@ui-sdk/react/textarea";
import { toast } from "@ui-sdk/react/toast";
import { useState } from "react";
import { button } from "@/components/ui/button";
import { shock } from "@/lib/shock";

type ApiResponse = { message?: string; error?: string };

export function ContactForm() {
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const body = (await response.json()) as ApiResponse;

      if (response.ok) {
        toast.success("Message sent", {
          description: "Thanks for writing. I'll get back to you soon.",
        });
        form.reset();
        shock(0.8);
      } else {
        toast.error("Message not sent", {
          description: body.error ?? "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.error("Message not sent", {
        description: "Check your connection and try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 text-left">
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" className="field">
          <FieldLabel className="field-label">Name</FieldLabel>
          <Input
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            className="field-control h-11"
          />
          <FieldError match="valueMissing" className="field-error">
            Enter your name.
          </FieldError>
        </Field>
        <Field name="email" className="field">
          <FieldLabel className="field-label">Email</FieldLabel>
          <Input
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="hello@flakenstine.dev"
            className="field-control h-11"
          />
          <FieldError match="valueMissing" className="field-error">
            Enter your email address.
          </FieldError>
          <FieldError match="typeMismatch" className="field-error">
            Enter an email address like hello@flakenstine.dev.
          </FieldError>
        </Field>
      </div>
      <Field name="message" className="field">
        <FieldLabel className="field-label">Message</FieldLabel>
        <Textarea
          required
          minLength={10}
          maxLength={5000}
          placeholder="Type your message here"
          className="field-control min-h-36 resize-y py-3"
        />
        <FieldError match="valueMissing" className="field-error">
          Enter a message.
        </FieldError>
        <FieldError match="tooShort" className="field-error">
          Make it at least 10 characters.
        </FieldError>
      </Field>
      <Button
        type="submit"
        disabled={sending}
        focusableWhenDisabled
        className={button("solid", "w-full")}
      >
        {sending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
