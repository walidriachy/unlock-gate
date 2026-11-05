"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card-2 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface-3)] text-xl">
          ✅
        </div>
        <h2 className="mt-4 text-xl font-bold">Thanks — we read everything.</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm muted">
          Your message is with us. This is a study clone, so there's no inbox behind the form, but in
          a real product someone would read this and reply to {email || "you"}.
        </p>
        <button
          type="button"
          className="btn btn-secondary mt-5"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="textarea"
            placeholder="What are you trying to build? The more detail the better."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-6">
        Send message
      </button>
      <p className="mt-3 text-xs faint">
        We usually reply within a couple of days. No newsletter, no auto-sequence.
      </p>
    </form>
  );
}
