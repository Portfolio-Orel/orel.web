import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

const LoginPage = () => (
  <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]"
    />
    <div className="relative w-full max-w-[400px]">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.85)]" />
        </span>
        <h1 className="mt-5 text-2xl font-medium tracking-tight text-zinc-50">Bot status</h1>
        <p className="mt-2 text-sm text-zinc-400">Private floor for your assistants.</p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-xs text-zinc-600">Not indexed. Sign-in stays on this browser.</p>
    </div>
  </main>
);

export default LoginPage;
