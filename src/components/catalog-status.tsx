import Link from "next/link";
import { AlertCircle, Database, Sparkles } from "lucide-react";
import type { CatalogResult } from "@/lib/project-catalog";

export function CatalogStatus({
  result,
  itemName,
}: {
  result: Extract<CatalogResult<unknown>, { status: "unconfigured" | "error" }>;
  itemName: string;
}) {
  const unconfigured = result.status === "unconfigured";
  return (
    <section
      className="rounded-2xl border border-[#ead6a9] bg-[#fff9ed] p-6 sm:p-8"
      role="status"
    >
      <span className="mb-4 grid size-11 place-items-center rounded-xl bg-[#f1e7cb] text-[#87640f]">
        {unconfigured ? <Database size={20} /> : <AlertCircle size={20} />}
      </span>
      <h2 className="text-lg font-semibold">
        {unconfigured ? `${itemName} are getting ready` : `Couldn’t load ${itemName}`}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#77736a]">
        {unconfigured
          ? `This page uses live project data from Supabase. Add the server-side Supabase settings and run the project catalog migration to see real ${itemName}. No sample counts or project results are being shown.`
          : result.message}
      </p>
      {unconfigured ? (
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[#765b1a]">
          <Sparkles size={14} />
          Setup instructions are in the project README.
        </p>
      ) : null}
      <Link
        className="mt-5 inline-flex rounded-lg border border-[#dfd2b7] px-3 py-2 text-sm font-semibold text-[#6e510d] no-underline hover:bg-[#fff3d4]"
        href="/dashboard"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
