import { Compass, LoaderCircle } from "lucide-react";

export function LoadingScreen() {
  return (
    <div
      aria-label="Loading page"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-[#24221e]/10 p-4 backdrop-blur-md"
      role="status"
    >
      <div className="flex min-w-56 flex-col items-center rounded-3xl border border-[#e8e1d4] bg-[#faf7f0]/95 px-8 py-7 text-center shadow-[0_24px_70px_rgba(59,46,20,0.16)]">
        <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-[#d6a72c] text-white shadow-[0_7px_18px_rgba(161,119,19,0.2)]">
          <Compass aria-hidden="true" size={23} />
        </span>
        <span className="text-xs font-extrabold tracking-[0.2em] text-[#24221e]">
          ZENTRO
        </span>
        <span className="mt-2 inline-flex items-center gap-2 text-sm text-[#77736a]">
          <LoaderCircle
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
            size={15}
          />
          Loading your page…
        </span>
      </div>
    </div>
  );
}
