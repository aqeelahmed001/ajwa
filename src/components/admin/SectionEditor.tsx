"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from './RichTextEditor'
import { IContent } from '@/models/content'
import { toast } from 'sonner'

interface SectionField {
  key: string
  label: string
  type: 'text' | 'richtext' | 'image'
  description?: string
}

interface SectionEditorProps {
  pageId: string
  section: string
  fields: SectionField[]
  lang: 'en' | 'ja'
  onSave?: () => void
}

export function SectionEditor({ pageId, section, fields, lang, onSave }: SectionEditorProps) {
  const [loading, setLoading] = useState(false)
  const [contents, setContents] = useState<Record<string, IContent>>({})

  // Fetch existing content
  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/content?pageId=${pageId}&section=${section}&lang=${lang}`)
      if (!response.ok) throw new Error('Failed to fetch content')
      const data: IContent[] = await response.json()
      
      // Convert to record by key
      const contentMap = data.reduce((acc, content) => {
        acc[content.key] = content
        return acc
      }, {} as Record<string, IContent>)
      
      setContents(contentMap)
    } catch (error) {
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  // Save content
  const saveContent = async (key: string, content: string, type: 'text' | 'richtext' | 'image') => {
    try {
      setLoading(true)
      const existing = contents[key]
      const method = existing ? 'PUT' : 'POST'
      const body = {
        pageId,
        section,
        language: lang,
        key,
        content,
        type: type === 'richtext' ? 'html' : type,
        _id: existing?._id
      }

      const response = await fetch('/api/admin/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save content')
      
      const savedContent = await response.json()
      setContents(prev => ({ ...prev, [key]: savedContent }))
      toast.success('Content saved')
      onSave?.()
    } catch (error) {
      toast.error('Failed to save content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {section} Content ({lang.toUpperCase()})</CardTitle>
        <CardDescription>
          Edit the content for this section. Changes will be visible on the website immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label>{field.label}</Label>
            {field.description && (
              <p className="text-sm text-slate-500">{field.description}</p>
            )}
            {field.type === 'richtext' ? (
              <RichTextEditor
                content={contents[field.key]?.content || ''}
                onChange={(content) => saveContent(field.key, content, 'richtext')}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            ) : field.type === 'image' ? (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Image URL"
                  value={contents[field.key]?.content || ''}
                  onChange={(e) => saveContent(field.key, e.target.value, 'image')}
                />
                {contents[field.key]?.content && (
                  <img
                    src={contents[field.key].content}
                    alt={field.label}
                    className="max-h-40 object-contain rounded-md border"
                  />
                )}
              </div>
            ) : (
              <Input
                value={contents[field.key]?.content || ''}
                onChange={(e) => saveContent(field.key, e.target.value, 'text')}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
