import { useEffect, useState } from 'react';

type ContentMap = Record<string, string>;

let contentCache: ContentMap | null = null;
let contentRequest: Promise<ContentMap> | null = null;

export function invalidateContentCache() {
  contentCache = null;
  contentRequest = null;
}

async function fetchContent() {
  if (contentCache) return contentCache;
  if (!contentRequest) {
    contentRequest = fetch('/api/content')
      .then((response) => {
        if (!response.ok) throw new Error('Nem sikerült betölteni a tartalmat.');
        return response.json();
      })
      .then((data) => {
        contentCache = data.content || {};
        return contentCache;
      })
      .catch((error) => {
        contentRequest = null;
        throw error;
      });
  }

  return contentRequest;
}

export function useContent(fallbacks: ContentMap) {
  const [content, setContent] = useState<ContentMap>(fallbacks);

  useEffect(() => {
    let isMounted = true;

    fetchContent()
      .then((loadedContent) => {
        if (isMounted) {
          setContent({ ...fallbacks, ...loadedContent });
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(fallbacks);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (key: string) => content[key] || fallbacks[key] || '';
}
