"use client";

import { useBookCover } from "@/hooks/useBookCover";

interface BookCoverProps {
  title: string;
  author: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-8",
  md: "h-24 w-16",
  lg: "h-36 w-24",
};

export function BookCover({ title, author, size = "md", className = "" }: BookCoverProps) {
  const { cover, loading } = useBookCover(title, author);

  const sizeClass = sizeClasses[size];

  if (loading) {
    return (
      <div
        className={`${sizeClass} animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 ${className}`}
      />
    );
  }

  if (!cover) {
    // Fallback placeholder with book icon
    return (
      <div
        className={`${sizeClass} flex items-center justify-center rounded bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 ${className}`}
      >
        <svg
          className="h-1/2 w-1/2 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={cover}
      alt={`Cover of ${title}`}
      className={`${sizeClass} rounded object-cover shadow-md ${className}`}
    />
  );
}
