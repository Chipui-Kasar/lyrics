'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IArtists, ILyrics } from '@/models/IObjects';
import SearchResult from './SearchResult';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const query = decodeURIComponent(queryParam);
  const [data, setData] = useState<{ lyrics: ILyrics[]; artists: IArtists[] }>({
    lyrics: [],
    artists: [],
  });

  useEffect(() => {
    if (!query) {
      setData({ lyrics: [], artists: [] });
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Search fetch failed', err);
      }
    };
    fetchData();
  }, [query]);

  return <SearchResult params={query} lyrics={data} />;
}
