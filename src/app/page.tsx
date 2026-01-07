import { CurrentBook } from "@/components/CurrentBook";
import { StatsOverview } from "@/components/StatsOverview";
import { MemberStats } from "@/components/MemberStats";
import { FullSchedule } from "@/components/FullSchedule";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Book Club Dashboard</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">Track what we&apos;re reading and who picked it</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Current Book + Next Book */}
          <CurrentBook />

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Full Schedule */}
            <div className="lg:col-span-2">
              <FullSchedule />
            </div>

            {/* Right Column - Member Stats */}
            <div>
              <MemberStats />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Book Club Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
