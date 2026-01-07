import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BookRow {
  id: string;
  month: string;
  year: number;
  member: string;
  book: string | null;
  author: string | null;
  link: string | null;
  created_at: string;
  updated_at: string;
}

export async function getBooks(): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (error) {
    console.error('Error fetching books:', error);
    return [];
  }

  return data || [];
}

export async function upsertBook(book: {
  month: string;
  year: number;
  member: string;
  book: string;
  author: string;
  link?: string;
}): Promise<BookRow | null> {
  const { data, error } = await supabase
    .from('books')
    .upsert(
      {
        month: book.month,
        year: book.year,
        member: book.member,
        book: book.book,
        author: book.author,
        link: book.link || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'month,year' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting book:', error);
    return null;
  }

  return data;
}
