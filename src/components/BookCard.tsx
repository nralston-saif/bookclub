"use client";

import { BookEntry } from "@/data/books";
import { BookCover } from "./BookCover";

interface BookCardProps {
  book: BookEntry;
  showDate?: boolean;
  featured?: boolean;
}

export function BookCard({ book, showDate = true, featured = false }: BookCardProps) {
  return (
    <div
      className={`flex gap-4 rounded-xl border p-4 transition-all hover:shadow-md ${
        featured
          ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-900 dark:from-amber-950/30 dark:to-orange-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <BookCover title={book.book} author={book.author} size="md" className="flex-shrink-0" />
      <div className="min-w-0 flex-1">
        {showDate && (
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {book.month} {book.year}
          </p>
        )}
        <h3 className={`mt-1 font-semibold text-zinc-900 dark:text-zinc-100 ${featured ? "text-xl" : "text-lg"}`}>
          {book.book}
        </h3>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">by {book.author}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {book.member}
          </span>
          {book.link && (
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-600 hover:underline dark:text-amber-400"
            >
              View on Amazon
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
