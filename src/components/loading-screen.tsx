import { LoaderCircle } from "lucide-react";

export function LoadingScreen() {
  return (
    <div
      aria-label="Loading page"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-[#1b1b1b]/10 p-4 backdrop-blur-md"
      role="status"
    >
      <div className="flex min-w-56 flex-col items-center rounded-3xl border border-[#e4e4e2] bg-[#fcfcfb]/95 px-8 py-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <span className="text-xs font-extrabold tracking-[0.2em] text-[#1b1b1b]">
          ZENTRO
        </span>
        <span className="mt-2 inline-flex items-center gap-2 text-sm text-[#666666]">
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
