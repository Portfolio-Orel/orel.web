"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { apiPath, safeClientError } from "@/lib/format";

export const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(apiPath("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        setError(safeClientError(body) ?? "Could not sign in.");
        return;
      }
      router.push("/bots");
      router.refresh();
    } catch {
      setError("Could not reach the floor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6"
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Username</span>
          <input
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-50 outline-none transition focus:border-white/30"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-zinc-400">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-zinc-50 outline-none transition focus:border-white/30"
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-5 h-11 w-full rounded-full bg-white text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
};
