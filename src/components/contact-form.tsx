"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";
import { toast } from "sonner";

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    const promise = new Promise<{ message: string; data: ContactFormValues }>(
      (resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure
          if (Math.random() > 0.5) {
            resolve({
              message: "Message sent successfully!",
              data,
            });
          } else {
            reject(new Error("Failed to send message. Please try again."));
          }
        }, 1000);
      },
    );

    try {
      toast.promise(promise, {
        loading: "Sending message...",
        success: (data) => {
          form.reset();
          return "Message sent successfully!";
        },
        error: (err: unknown) => {
          const error = err as Error;
          return error.message ?? "Something went wrong";
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="hello@flakenstine.dev"
                  type="email"
                  className="w-full rounded bg-white/10 p-2 focus:ring-[#00FF9D] focus:ring-offset-0"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type your message here"
                  className="h-32 w-full rounded bg-white/10 p-2 focus:ring-[#00FF9D] focus:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded bg-[#00FF9D] py-2 text-black hover:bg-[#00FF9D]/90 hover:text-black disabled:opacity-50"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              Sending...
            </div>
          ) : (
            "Send message"
          )}
        </Button>
      </form>
    </Form>
  );
}
