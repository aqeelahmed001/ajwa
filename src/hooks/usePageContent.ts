"use client"

import { useState, useEffect } from 'react'
import { IContent } from '@/models/content'

interface UsePageContentProps {
  pageId: string
  section: string
  lang: string
}

export function usePageContent({ pageId, section, lang }: UsePageContentProps) {
  const [contents, setContents] = useState<Record<string, string>>({})
  const [rawData, setRawData] = useState<IContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true)
        // Include credentials to send cookies with the request
        const response = await fetch(`/api/admin/content?pageId=${pageId}&section=${section}`, {
          credentials: 'include' // This will include cookies in the request
        })
        
        if (!response.ok) {
          console.error(`Content fetch failed with status: ${response.status}`)
          throw new Error('Failed to fetch content')
        }
        const data: IContent[] = await response.json()
        setRawData(data)
        
        console.log(`Raw content data for ${pageId}/${section}:`, 
          data.map(item => ({ key: item.key, language: item.language, type: item.type, content: item.content.substring(0, 30) })));
        
        // Convert array of contents to a key-value object
        const contentMap: Record<string, string> = {};
        
        // First, process language-specific content
        const currentLangItems = data.filter(item => item.language === lang);
        
        // Add all items for current language
        currentLangItems.forEach(item => {
          // Store with original key for direct access
          contentMap[item.key] = item.content;
          
          // For keys with language suffix (e.g., leftDescription_ja), also store with base key
          if (item.key.endsWith(`_${lang}`)) {
            const baseKey = item.key.slice(0, -3); // Remove _xx suffix
            contentMap[baseKey] = item.content;
          } else {
            // For keys without language suffix, store as is
            contentMap[item.key] = item.content;
          }
        });
        
        // Then add fallbacks from other languages for any missing keys
        const otherLangItems = data.filter(item => item.language !== lang);
        otherLangItems.forEach(item => {
          // Store with original key for direct access
          contentMap[item.key] = item.content;
          
          // For keys with language suffix, extract base key
          let baseKey = item.key;
          if (item.key.match(/_[a-z]{2}$/)) {
            baseKey = item.key.slice(0, -3); // Remove _xx suffix
          }
          
          // Only use as fallback if we don't already have this key
          if (!contentMap[baseKey]) {
            contentMap[baseKey] = item.content;
          }
        });
        
        console.log(`Processed ${Object.keys(contentMap).length} content items for ${pageId}/${section} in ${lang}:`, contentMap);
        
        setContents(contentMap)
        setError(null)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch content')
      } finally {
        setLoading(false)
      }
    }

    fetchContents()
  }, [pageId, section, lang])

  const getContent = (key: string, fallback: string = '') => {
    // First try with language suffix if we're not already using a suffixed key
    if (!key.endsWith(`_${lang}`)) {
      const langKey = `${key}_${lang}`;
      if (contents[langKey]) {
        return contents[langKey];
      }
    }
    
    // Then try the exact key as provided
    if (contents[key]) {
      return contents[key];
    }
    
    // Try the base key if this is a language-specific key for another language
    if (key.match(/_[a-z]{2}$/)) {
      const baseKey = key.slice(0, -3); // Remove _xx suffix
      if (contents[baseKey]) {
        return contents[baseKey];
      }
    }
    
    // Finally use fallback
    return fallback;
  }

  return {
    contents,
    rawData,
    getContent,
    loading,
    error
  }
}
