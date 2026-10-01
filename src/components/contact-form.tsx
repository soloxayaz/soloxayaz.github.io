import { type FormEvent, useState } from "react";
import { site } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "sending" | "ok" | "fail";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;

    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name) next.name = "Enter your name or nickname.";
    if (!email) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!message) next.message = "Write a message.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch(site.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("ok");
    } catch {
      setStatus("fail");
    }
  }

  if (status === "ok") {
    return (
      <p role="status" className="font-display text-2xl text-paper italic">
        Message sent. Thanks for reaching out.{" "}
        <button
          type="button"
          className="link-draw ml-2 font-mono text-xs tracking-[0.16em] text-accent not-italic uppercase"
          onClick={() => setStatus("idle")}
        >
          send another
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-7">
      <div>
        <Label htmlFor="name">name / nickname</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-e" : undefined}
        />
        {errors.name && (
          <p id="name-e" role="alert" className="mt-2 text-sm text-dusk">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="email">email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-e" : undefined}
        />
        {errors.email && (
          <p id="email-e" role="alert" className="mt-2 text-sm text-dusk">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="github">github username (optional)</Label>
        <Input id="github" name="github" autoComplete="off" />
      </div>
      <div>
        <Label htmlFor="message">message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-e" : undefined}
        />
        {errors.message && (
          <p id="message-e" role="alert" className="mt-2 text-sm text-dusk">
            {errors.message}
          </p>
        )}
      </div>
      <input type="hidden" name="_subject" value="New message from THE GREAT AYAZ site" />
      <input
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "sending..." : "send message"}
      </Button>
      {status === "fail" && (
        <p role="alert" className="text-sm text-dusk">
          Message not sent. Check your connection and try again.
        </p>
      )}
    </form>
  );
}
