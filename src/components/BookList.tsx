"use client";

import { BookEntry } from "@/data/books";
import { BookCard } from "./BookCard";

interface BookListProps {
  title: string;
  books: BookEntry[];
  emptyMessage?: string;
  maxItems?: number;
}

export function BookList({ title, books, emptyMessage = "No books to show", maxItems }: BookListProps) {
  const displayBooks = maxItems ? books.slice(0, maxItems) : books;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">{books.length} books</span>
      </div>
      {displayBooks.length > 0 ? (
        <div className="mt-4 space-y-3">
          {displayBooks.map((book, index) => (
            <BookCard key={`${book.month}-${book.year}`} book={book} />
          ))}
          {maxItems && books.length > maxItems && (
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              +{books.length - maxItems} more
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">{emptyMessage}</p>
      )}
    </div>
  );
}
