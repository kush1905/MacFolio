"use client";

import { useEffect, useState, type FocusEvent, type FormEvent } from "react";
import { useSceneStore } from "@/store/sceneStore";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const setContact = useSceneStore((state) => state.setContact);

  // The 3D finale brightens while someone writes and fires a shockwave when a message is sent.
  useEffect(() => {
    if (status.kind !== "sent") return;
    setContact("sent");
    const timer = window.setTimeout(() => setContact("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [status.kind, setContact]);

  function onFocus() {
    if (useSceneStore.getState().contact !== "sent") setContact("composing");
  }

  function onBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null) && useSceneStore.getState().contact === "composing") {
      setContact("idle");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            res.status === 429
              ? "Too many messages from this connection. Please email instead."
              : res.status === 503
                ? "The message service is unavailable right now. Please email instead."
                : (body.error ?? "Something went wrong. Please email instead."),
        });
        return;
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please email instead." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="contact-done" role="status">
        <p className="contact-done-title">Message received</p>
        <p>Thanks — Kush will reply by email.</p>
        <button type="button" className="btn btn-small" onClick={() => setStatus({ kind: "idle" })}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} onFocus={onFocus} onBlur={onBlur} noValidate={false}>
      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" required maxLength={100} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
        />
      </div>
      <div className="field field-wide">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={5} />
      </div>
      <div className="field-trap" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="contact-submit">
        <button className="btn btn-primary" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send transmission"}
        </button>
        {status.kind === "error" ? (
          <p className="contact-error" role="alert">
            {status.message} <a href={`mailto:${email}`}>{email}</a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
