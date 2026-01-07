"use client";

import { useState, useEffect } from "react";

const coverCache: Record<string, string | null> = {};

export function useBookCover(title: string, author: string): { cover: string | null; loading: boolean } {
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!title || !author) {
      setLoading(false);
      return;
    }

    const cacheKey = `${title}-${author}`;

    // Check cache first
    if (cacheKey in coverCache) {
      setCover(coverCache[cacheKey]);
      setLoading(false);
      return;
    }

    const fetchCover = async () => {
      try {
        const query = encodeURIComponent(`${title} ${author}`);
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`
        );
        const data = await response.json();

        if (data.items && data.items[0]?.volumeInfo?.imageLinks) {
          // Get the thumbnail and upgrade to larger size
          let imageUrl = data.items[0].volumeInfo.imageLinks.thumbnail ||
                         data.items[0].volumeInfo.imageLinks.smallThumbnail;

          // Upgrade image size by modifying the zoom parameter
          if (imageUrl) {
            imageUrl = imageUrl.replace("zoom=1", "zoom=2");
            // Use HTTPS
            imageUrl = imageUrl.replace("http://", "https://");
          }

          coverCache[cacheKey] = imageUrl;
          setCover(imageUrl);
        } else {
          coverCache[cacheKey] = null;
          setCover(null);
        }
      } catch (error) {
        console.error("Error fetching book cover:", error);
        coverCache[cacheKey] = null;
        setCover(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCover();
  }, [title, author]);

  return { cover, loading };
}
