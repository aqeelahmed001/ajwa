import { useState, useEffect } from 'react';
import { IContent } from '@/models/content';

export function useContent(pageId: string, section?: string) {
  const [contents, setContents] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ pageId });
        if (section) params.append('section', section);

        const response = await fetch(`/api/admin/content?${params}`);
        if (!response.ok) throw new Error('Failed to fetch content');

        const data = await response.json();
        setContents(data);
        setError(null);
      } catch (error) {
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [pageId, section]);

  const getContent = (key: string) => {
    return contents.find(content => content.key === key);
  };

  return {
    contents,
    getContent,
    loading,
    error,
  };
}
