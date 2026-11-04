import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f0e6] px-6 text-[#24221e]">
      <div className="max-w-lg rounded-3xl border border-[#e8e1d4] bg-[#faf7f0] p-10 text-center shadow-[0_24px_70px_rgba(59,46,20,0.08)]">
        <p className="text-sm font-extrabold tracking-[0.2em]">ZENTRO</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
          Find Your Direction. Build Your Future.
        </h1>
        <p className="mt-3 leading-7 text-[#77736a]">
          Discover projects, explore technologies and get the guidance you need
          to build with confidence.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#d6a72c] px-6 font-semibold text-[#24221e] transition hover:bg-[#e0b53e]"
          href="/sign-in"
        >
          Continue to sign in
        </Link>
      </div>
    </main>
  );
}
