"use client";

import { useState } from "react";
import { BookEntry, monthOrder } from "@/data/books";
import { BookCover } from "./BookCover";
import { useBooks } from "@/hooks/useBooks";

interface BookInputFormProps {
  member: string;
  month: string;
  year: number;
  onSubmit: (title: string, author: string) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
  initialTitle?: string;
  initialAuthor?: string;
  isEdit?: boolean;
}

function BookInputForm({
  member,
  month,
  year,
  onSubmit,
  onCancel,
  submitting,
  initialTitle = "",
  initialAuthor = "",
  isEdit = false
}: BookInputFormProps) {
  const [bookTitle, setBookTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(bookTitle, author);
    if (!isEdit) {
      setBookTitle("");
      setAuthor("");
    }
  };

  return (
    <>
      {!isEdit && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            {member.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{member}&apos;s Pick</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Not yet selected</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={`space-y-3 ${isEdit ? "" : "mt-4"}`}>
        <input
          type="text"
          placeholder="Book title"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          disabled={submitting}
          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={submitting}
          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!bookTitle || !author || submitting}
            className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Submit Book Pick"}
          </button>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

interface BookDisplayProps {
  book: BookEntry;
  light?: boolean;
  onEdit: () => void;
}

function BookDisplay({ book, light = false, onEdit }: BookDisplayProps) {
  if (!book.book || !book.author) return null;

  if (light) {
    return (
      <div className="mt-3 flex gap-4">
        <BookCover title={book.book} author={book.author} size="lg" className="flex-shrink-0 shadow-lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {book.book}
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">by {book.author}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                {book.member.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Selected by</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{book.member}</p>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex gap-4">
      <BookCover title={book.book} author={book.author} size="lg" className="flex-shrink-0 shadow-lg" />
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold">{book.book}</h2>
        <p className="mt-1 text-amber-100">by {book.author}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
              {book.member.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-amber-100">Selected by</p>
              <p className="font-semibold">{book.member}</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export function CurrentBook() {
  const { getBookForMonth, getMemberForMonth, getNextMonthYear, submitBook, loading } = useBooks();
  const [submitting, setSubmitting] = useState(false);
  const [editingCurrent, setEditingCurrent] = useState(false);
  const [editingNext, setEditingNext] = useState(false);

  const now = new Date();
  const currentMonth = monthOrder[now.getMonth()];
  const currentYear = now.getFullYear();

  const currentBook = getBookForMonth(currentMonth, currentYear);
  const currentMember = getMemberForMonth(currentMonth, currentYear);

  const { month: nextMonth, year: nextYear } = getNextMonthYear(currentMonth, currentYear);
  const nextBook = getBookForMonth(nextMonth, nextYear);
  const nextMember = getMemberForMonth(nextMonth, nextYear);

  const handleCurrentSubmit = async (title: string, author: string) => {
    setSubmitting(true);
    await submitBook(currentMonth, currentYear, currentMember, title, author);
    setSubmitting(false);
    setEditingCurrent(false);
  };

  const handleNextSubmit = async (title: string, author: string) => {
    setSubmitting(true);
    await submitBook(nextMonth, nextYear, nextMember, title, author);
    setSubmitting(false);
    setEditingNext(false);
  };

  const hasCurrentBook = currentBook && currentBook.book;
  const hasNextBook = nextBook && nextBook.book;

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Current Book */}
      {hasCurrentBook && !editingCurrent ? (
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl">
          <p className="text-sm font-medium text-amber-100">
            Currently Reading - {currentMonth} {currentYear}
          </p>
          <BookDisplay book={currentBook} onEdit={() => setEditingCurrent(true)} />
        </div>
      ) : (
        <div className={`rounded-2xl border-2 border-dashed p-6 ${
          hasCurrentBook
            ? "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
            : "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
        }`}>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {editingCurrent ? "Edit" : "Currently Reading"} - {currentMonth} {currentYear}
          </p>
          <BookInputForm
            member={currentMember}
            month={currentMonth}
            year={currentYear}
            onSubmit={handleCurrentSubmit}
            onCancel={hasCurrentBook ? () => setEditingCurrent(false) : undefined}
            submitting={submitting}
            initialTitle={currentBook?.book || ""}
            initialAuthor={currentBook?.author || ""}
            isEdit={editingCurrent && hasCurrentBook}
          />
        </div>
      )}

      {/* Next Book */}
      {hasNextBook && !editingNext ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Next Up - {nextMonth} {nextYear}
          </p>
          <BookDisplay book={nextBook} light onEdit={() => setEditingNext(true)} />
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {editingNext ? "Edit" : "Next Up"} - {nextMonth} {nextYear}
          </p>
          <BookInputForm
            member={nextMember}
            month={nextMonth}
            year={nextYear}
            onSubmit={handleNextSubmit}
            onCancel={hasNextBook ? () => setEditingNext(false) : undefined}
            submitting={submitting}
            initialTitle={nextBook?.book || ""}
            initialAuthor={nextBook?.author || ""}
            isEdit={editingNext && hasNextBook}
          />
        </div>
      )}
    </div>
  );
}
