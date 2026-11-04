"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Compass,
  FolderKanban,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Explore Categories", icon: Compass },
  { href: "/projects", label: "All Projects", icon: FolderKanban },
  { href: "/my-profile", label: "My Profile", icon: UserRound },
];

export function PlatformShell({
  children,
  studentName,
}: {
  children: ReactNode;
  studentName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function signOut() {
    setSignOutError("");
    setIsSigningOut(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not sign out.";
      console.error("Could not sign out:", message);
      setSignOutError(message);
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1b1b1b]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#e4e4e2] bg-[#fcfcfb] px-5 py-6 lg:flex">
        <Link
          aria-label="ZENTRO dashboard"
          className="mb-10 inline-flex items-center gap-3 px-2 text-sm font-extrabold tracking-[0.2em] text-[#1b1b1b] no-underline"
          href="/dashboard"
        >
          ZENTRO
        </Link>

        <p className="mb-3 px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#777777]">
          Your space
        </p>
        <nav aria-label="Main navigation" className="grid gap-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(`${href}/`));
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium no-underline transition ${
                  active
                    ? "bg-[#ebebea] text-[#555555]"
                    : "text-[#666666] hover:bg-[#f7f7f5] hover:text-[#1b1b1b]"
                }`}
                href={href}
                key={href}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-[#e4e4e2] bg-[#ffffff] p-4">
          <p className="text-sm font-semibold">Keep exploring</p>
          <p className="mt-1 text-xs leading-5 text-[#666666]">
            Every project is a chance to learn something new.
          </p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#454545] no-underline hover:underline"
            href="/projects"
          >
            Browse projects <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#e4e4e2] bg-[#fcfcfb]/95 backdrop-blur">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-7">
            <Link
              className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-[#1b1b1b] no-underline lg:hidden"
              href="/dashboard"
            >
              ZENTRO
            </Link>
            <div className="hidden text-sm text-[#666666] sm:block">
              {studentName ? (
                <>
                  Welcome back,{" "}
                  <span className="font-semibold text-[#1b1b1b]">
                    {studentName}
                  </span>
                </>
              ) : (
                "A little progress, one project at a time."
              )}
            </div>
            <button
              aria-busy={isSigningOut}
              aria-label={isSigningOut ? "Signing out" : "Sign out"}
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e4e4e2] bg-[#ffffff] px-3 text-xs font-semibold text-[#555555] transition hover:border-[#e5e5e3] hover:text-[#1b1b1b] disabled:opacity-60"
              disabled={isSigningOut}
              onClick={signOut}
              type="button"
            >
              {isSigningOut ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" size={14} />
              ) : (
                <LogOut aria-hidden="true" size={14} />
              )}
              <span className="hidden sm:inline" aria-hidden="true">
                {isSigningOut ? "Signing out…" : "Sign out"}
              </span>
              <span className="sr-only">
                {isSigningOut ? "Signing out…" : "Sign out"}
              </span>
            </button>
          </div>
          {signOutError ? (
            <p className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-800 sm:px-7" role="alert">
              {signOutError}
            </p>
          ) : null}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-wrap gap-2 border-t border-[#e4e4e2] px-4 py-2 lg:hidden"
          >
            {navigation.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium no-underline ${
                    active
                      ? "bg-[#ebebea] text-[#555555]"
                      : "text-[#666666]"
                  }`}
                  href={href}
                  key={href}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-7 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
