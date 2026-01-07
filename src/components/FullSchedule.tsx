"use client";

import { getMonthIndex } from "@/data/books";
import { BookCover } from "./BookCover";
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

export function FullSchedule() {
  const { books, loading } = useBooks();

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();

  // Group by year
  const booksByYear: Record<number, typeof books> = {};
  books.forEach((book) => {
    if (!booksByYear[book.year]) booksByYear[book.year] = [];
    booksByYear[book.year].push(book);
  });

  // Sort books within each year by month (descending)
  Object.keys(booksByYear).forEach((year) => {
    booksByYear[Number(year)].sort((a, b) =>
      getMonthIndex(b.month) - getMonthIndex(a.month)
    );
  });

  const isPast = (book: (typeof books)[0]) => {
    if (book.year < currentYear) return true;
    if (book.year === currentYear && getMonthIndex(book.month) < currentMonthIdx) return true;
    return false;
  };

  const isCurrent = (book: (typeof books)[0]) => {
    return book.year === currentYear && getMonthIndex(book.month) === currentMonthIdx;
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Full Schedule</h3>
        <div className="mt-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Full Schedule</h3>
      <div className="mt-6 space-y-8">
        {Object.entries(booksByYear)
          .sort(([a], [b]) => Number(b) - Number(a)) // Years descending
          .map(([year, yearBooks]) => (
            <div key={year}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {year}
              </h4>
              <div className="space-y-2">
                {yearBooks.map((book) => {
                  const past = isPast(book);
                  const current = isCurrent(book);
                  return (
                    <div
                      key={`${book.month}-${book.year}`}
                      className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                        current
                          ? "bg-amber-50 ring-2 ring-amber-500 dark:bg-amber-950/30"
                          : past
                          ? "bg-zinc-50 dark:bg-zinc-800/50"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className="w-12 flex-shrink-0">
                        <span
                          className={`text-sm font-medium ${
                            past ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {book.month.slice(0, 3)}
                        </span>
                      </div>
                      {book.book && book.author ? (
                        <BookCover
                          title={book.book}
                          author={book.author}
                          size="sm"
                          className={`flex-shrink-0 ${past ? "opacity-60" : ""}`}
                        />
                      ) : (
                        <div
                          className={`flex h-12 w-8 flex-shrink-0 items-center justify-center rounded text-sm font-semibold text-white ${
                            memberColors[book.member] || "bg-zinc-500"
                          } ${past ? "opacity-60" : ""}`}
                        >
                          ?
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-medium ${
                            past
                              ? "text-zinc-500 dark:text-zinc-400"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {book.book || "Not yet selected"}
                        </p>
                        <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                          {book.author ? `${book.author} · ` : ""}{book.member}
                        </p>
                      </div>
                      {current && (
                        <span className="flex-shrink-0 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
                          Now
                        </span>
                      )}
                      {past && (
                        <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
