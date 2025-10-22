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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/content?pageId=${pageId}&section=${section}`)
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }
        const data: IContent[] = await response.json()
        
        // Convert array of contents to a key-value object for the specific language
        const contentMap = data
          .filter(item => item.language === lang)
          .reduce((acc, item) => {
            acc[item.key] = item.content
            return acc
          }, {} as Record<string, string>)
        
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
    return contents[key] || fallback
  }

  return {
    contents,
    getContent,
    loading,
    error
  }
}
