export interface BookEntry {
  id?: string;
  month: string;
  year: number;
  member: string;
  book: string | null;
  author: string | null;
  link?: string | null;
}

export const members = ["Tommy", "Brett", "Sampson", "Drew", "Parker", "Ian", "Ward", "Nick", "Sechler"];

export const monthOrder = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getMonthIndex(month: string): number {
  return monthOrder.indexOf(month);
}

export function sortByDate(a: BookEntry, b: BookEntry): number {
  if (a.year !== b.year) return a.year - b.year;
  return getMonthIndex(a.month) - getMonthIndex(b.month);
}

export function sortByDateDesc(a: BookEntry, b: BookEntry): number {
  if (a.year !== b.year) return b.year - a.year;
  return getMonthIndex(b.month) - getMonthIndex(a.month);
}
