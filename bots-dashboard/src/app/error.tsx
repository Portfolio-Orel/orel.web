"use client";

const FloorError = ({ reset }: { reset: () => void }) => {
  const handleRetry = () => {
    reset();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">Bot status</p>
      <h1 className="mt-3 text-2xl font-medium tracking-tight">The floor hit a snag.</h1>
      <p className="mt-2 text-sm text-zinc-400">Nothing was changed. Try again in a moment.</p>
      <button
        type="button"
        onClick={handleRetry}
        className="mt-6 h-11 w-fit rounded-full bg-white px-5 text-sm font-medium text-zinc-950"
      >
        Try again
      </button>
    </main>
  );
};

export default FloorError;
