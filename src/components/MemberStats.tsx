"use client";

import { useBooks } from "@/hooks/useBooks";

const memberColors: Record<string, string> = {
  Tommy: "bg-red-500",
  Thalin: "bg-blue-500",
  Brett: "bg-green-500",
  Sampson: "bg-purple-500",
  Drew: "bg-yellow-500",
  Parker: "bg-pink-500",
  Ian: "bg-indigo-500",
  Ward: "bg-teal-500",
  Nick: "bg-orange-500",
  Sechler: "bg-cyan-500",
};

export function MemberStats() {
  const { books, loading } = useBooks();

  // Only count books that have been selected (have a title)
  const booksWithContent = books.filter((b) => b.book);

  const counts: Record<string, number> = {};
  booksWithContent.forEach((book) => {
    counts[book.member] = (counts[book.member] || 0) + 1;
  });

  const stats = Object.entries(counts)
    .map(([member, count]) => ({ member, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Books Selected by Member</h3>
        <div className="mt-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Books Selected by Member</h3>
      <div className="mt-4 space-y-3">
        {stats.map(({ member, count }) => (
          <div key={member} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${
                memberColors[member] || "bg-zinc-500"
              }`}
            >
              {member.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{member}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{count}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full ${memberColors[member] || "bg-zinc-500"}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
