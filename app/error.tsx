// app/error.tsx
"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center text-slate-400 text-sm">
      Something went wrong: {error.message}
    </div>
  );
}
