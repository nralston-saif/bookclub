"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, BookRow, upsertBook } from "@/lib/supabase";
import { BookEntry, getMonthIndex, monthOrder, members } from "@/data/books";

export function useBooks() {
  const [books, setBooks] = useState<BookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("year", { ascending: false });

      if (error) throw error;

      const sortedData = (data || []).sort((a: BookRow, b: BookRow) => {
        if (a.year !== b.year) return b.year - a.year;
        return getMonthIndex(b.month) - getMonthIndex(a.month);
      });

      setBooks(
        sortedData.map((row: BookRow) => ({
          id: row.id,
          month: row.month,
          year: row.year,
          member: row.member,
          book: row.book,
          author: row.author,
          link: row.link,
        }))
      );
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const submitBook = async (
    month: string,
    year: number,
    member: string,
    bookTitle: string,
    author: string
  ): Promise<boolean> => {
    try {
      const result = await upsertBook({
        month,
        year,
        member,
        book: bookTitle,
        author,
      });

      if (result) {
        await fetchBooks(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error submitting book:", err);
      return false;
    }
  };

  const getBookForMonth = (month: string, year: number): BookEntry | undefined => {
    return books.find((b) => b.month === month && b.year === year);
  };

  const getMemberForMonth = (month: string, year: number): string => {
    const existing = getBookForMonth(month, year);
    if (existing) return existing.member;

    // Find the last book with a member and predict rotation
    const booksWithMembers = books.filter((b) => b.member);
    if (booksWithMembers.length === 0) return members[0];

    const sortedBooks = [...booksWithMembers].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return getMonthIndex(b.month) - getMonthIndex(a.month);
    });

    const lastBook = sortedBooks[0];
    const lastMemberIdx = members.indexOf(lastBook.member);

    const lastDate = new Date(lastBook.year, getMonthIndex(lastBook.month));
    const targetDate = new Date(year, getMonthIndex(month));
    const monthsDiff =
      (targetDate.getFullYear() - lastDate.getFullYear()) * 12 +
      (targetDate.getMonth() - lastDate.getMonth());

    const predictedIdx = (lastMemberIdx + monthsDiff) % members.length;
    return members[predictedIdx >= 0 ? predictedIdx : predictedIdx + members.length];
  };

  const getCurrentBook = (): BookEntry | undefined => {
    const now = new Date();
    const currentMonth = monthOrder[now.getMonth()];
    const currentYear = now.getFullYear();
    return getBookForMonth(currentMonth, currentYear);
  };

  const getNextMonthYear = (
    month: string,
    year: number
  ): { month: string; year: number } => {
    const idx = getMonthIndex(month);
    if (idx === 11) {
      return { month: "January", year: year + 1 };
    }
    return { month: monthOrder[idx + 1], year };
  };

  return {
    books,
    loading,
    error,
    fetchBooks,
    submitBook,
    getBookForMonth,
    getMemberForMonth,
    getCurrentBook,
    getNextMonthYear,
  };
}
