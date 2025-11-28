import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      <Navbar />

      <div className="z-10 flex flex-col items-center text-center max-w-4xl px-4 animate-in fade-in zoom-in duration-500">
        {/* Pill Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-3 py-1 text-sm text-gray-600 backdrop-blur-sm dark:border-gray-800 dark:bg-black/50 dark:text-gray-300">
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New: AI 2.0 Integration
        </div>

        {/* H1 Headline */}
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl dark:text-white">
          EXPERIENCE LIFTOFF WITH <br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            INTELLIGENT MEETINGS & MEMORY
          </span>
        </h1>

        {/* Subtext */}
        <p className="mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Host video calls, auto-generate minutes, and store collaborative notes in one secure cloud.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="rounded-full bg-black px-8 py-4 text-base font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Get Started
          </Link>
          <a
            href="#"
            className="rounded-full border border-gray-300 bg-white/10 px-8 py-4 text-base font-semibold text-gray-900 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 dark:border-gray-700 dark:text-white"
          >
            View Demo
          </a>
        </div>
      </div>
    </main>
  );
}
