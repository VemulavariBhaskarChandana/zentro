import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-6 text-[#1b1b1b]">
      <div className="max-w-lg rounded-3xl border border-[#e4e4e2] bg-[#fcfcfb] p-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-extrabold tracking-[0.2em]">ZENTRO</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">
          Find Your Direction. Build Your Future.
        </h1>
        <p className="mt-3 leading-7 text-[#666666]">
          Discover projects, explore technologies and get the guidance you need
          to build with confidence.
        </p>
        <Link
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e5e5e3] px-6 font-semibold text-[#1b1b1b] transition hover:bg-[#d8d8d5]"
          href="/sign-in"
        >
          Continue to sign in
        </Link>
      </div>
    </main>
  );
}
