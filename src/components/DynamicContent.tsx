import Image from 'next/image';
import { useContent } from '@/hooks/useContent';

interface DynamicContentProps {
  pageId: string;
  contentKey: string;
  section?: string;
  fallback?: string;
  className?: string;
}

export function DynamicContent({
  pageId,
  contentKey,
  section,
  fallback = '',
  className = '',
}: DynamicContentProps) {
  const { getContent, loading } = useContent(pageId, section);
  const content = getContent(contentKey);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />;
  }

  if (!content) {
    return <>{fallback}</>;
  }

  if (content.type === 'image') {
    return (
      <Image
        src={content.content}
        alt={contentKey}
        width={500}
        height={300}
        className={className}
      />
    );
  }

  if (content.type === 'html') {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    );
  }

  return <div className={className}>{content.content}</div>;
}
