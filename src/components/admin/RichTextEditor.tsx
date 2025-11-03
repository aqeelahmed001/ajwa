"use client"

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false, // Fix for SSR hydration issues
  }, [isMounted])
  
  // Update content when it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor || !isMounted) {
    return (
      <div className="border rounded-md">
        <div className="border-b p-2 flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" disabled>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Quote className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="border-l mx-1" />
          <Button variant="ghost" size="sm" disabled>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="h-20 bg-slate-100 rounded flex items-center justify-center">
            <p className="text-sm text-slate-500">Loading editor...</p>
          </div>
        </div>
      </div>
    )
  }

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-slate-200' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-slate-200' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-slate-200' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="border-l mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  )
}

export default RichTextEditor;
