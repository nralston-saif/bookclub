"use client";

import { members, getMonthIndex, monthOrder } from "@/data/books";
import { useBooks } from "@/hooks/useBooks";

export function StatsOverview() {
  const { books, loading } = useBooks();

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();

  const pastBooks = books.filter((book) => {
    if (book.year < currentYear) return true;
    if (book.year === currentYear && getMonthIndex(book.month) < currentMonthIdx) return true;
    return false;
  });

  const booksWithContent = books.filter((b) => b.book);
  const uniqueAuthors = new Set(booksWithContent.map((b) => b.author)).size;

  const stats = [
    { label: "Total Books", value: booksWithContent.length, icon: "📚" },
    { label: "Members", value: members.length, icon: "👥" },
    { label: "Books Read", value: pastBooks.filter((b) => b.book).length, icon: "✓" },
    { label: "Unique Authors", value: uniqueAuthors, icon: "✍️" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="text-2xl">{stat.icon}</div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
