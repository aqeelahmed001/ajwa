"use client"

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ImageUploader } from '@/components/admin/ImageUploader'

interface Field {
  key: string
  label: string
  type: 'text' | 'richtext' | 'image'
  description?: string
}

interface Section {
  id: string
  label: string
  description?: string
  fields: Field[]
}

const SECTIONS: Section[] = [
  {
    id: 'hero',
    label: 'Hero Section',
    description: 'Main hero section content that appears at the top of the homepage',
    fields: [
      { key: 'categoryTag', label: 'Category Tag', type: 'text', description: 'Short text shown at the very top (e.g., "International Machinery Trading")' },
      { key: 'mainLeft', label: 'Left Heading', type: 'text', description: 'Main heading on the left side (e.g., "Buy a Machine")' },
      { key: 'mainRight', label: 'Right Heading', type: 'text', description: 'Main heading on the right side (e.g., "Sell a Machine")' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', description: 'Subtitle text shown below the category tag' },
      { key: 'leftDescription', label: 'Left Description', type: 'richtext', description: 'Descriptive text for the left (buy) section' },
      { key: 'rightDescription', label: 'Right Description', type: 'richtext', description: 'Descriptive text for the right (sell) section' },
      { key: 'ctaListings', label: 'Browse Button Text', type: 'text', description: 'Text for the browse listings button' },
      { key: 'ctaContact', label: 'Contact Button Text', type: 'text', description: 'Text for the contact button' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image', description: 'Background image URL for the hero section' },
    ],
  },
  {
    id: 'intro',
    label: 'Introduction Section',
    description: 'Company introduction section that appears below the hero',
    fields: [
      { key: 'title', label: 'Title', type: 'text', description: 'Main title of the introduction section' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', description: 'Subtitle or tagline' },
      { key: 'content', label: 'Content', type: 'richtext', description: 'Main content of the introduction' },
      { key: 'image', label: 'Image', type: 'image', description: 'Featured image URL' },
    ],
  },
  {
    id: 'cta',
    label: 'Call to Action',
    description: 'Call-to-action section to encourage user engagement',
    fields: [
      { key: 'title', label: 'Title', type: 'text', description: 'Main CTA heading' },
      { key: 'description', label: 'Description', type: 'richtext', description: 'Supporting text for the CTA' },
      { key: 'buttonText', label: 'Button Text', type: 'text', description: 'Text to display on the CTA button' },
      { key: 'backgroundImage', label: 'Background Image', type: 'image', description: 'Background image URL for the CTA section' },
    ],
  },
  {
    id: 'services',
    label: 'Services Section',
    description: 'Services and capabilities showcase',
    fields: [
      { key: 'title', label: 'Title', type: 'text', description: 'Main services section heading' },
      { key: 'subtitle', label: 'Subtitle', type: 'text', description: 'Services section subtitle' },
      { key: 'content', label: 'Content', type: 'richtext', description: 'Main content describing services' },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    description: 'Website footer content',
    fields: [
      { key: 'address', label: 'Address', type: 'text', description: 'Company address' },
      { key: 'phone', label: 'Phone', type: 'text', description: 'Contact phone number' },
      { key: 'email', label: 'Email', type: 'text', description: 'Contact email' },
      { key: 'copyright', label: 'Copyright', type: 'text', description: 'Copyright text' },
    ],
  },
]


interface Content {
  _id?: string
  pageId: string
  section: string
  language: 'en' | 'ja'
  key: string
  type: 'text' | 'image' | 'html'
  content: string
}

export function PageContent() {
  const [selectedLang, setSelectedLang] = useState<'en' | 'ja'>('en')
  const [selectedSection, setSelectedSection] = useState<string>(SECTIONS[0].id)
  const [contents, setContents] = useState<Record<string, Content>>({})
  const [rawContents, setRawContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  // Define fetchContent function
  const fetchContent = async () => {
    try {
      setLoading(true)
      // Fetch all content for the section, not just the selected language
      const response = await fetch(`/api/admin/content?pageId=home&section=${selectedSection}`, {
        credentials: 'include' // Include cookies for authentication
      })
      
      if (!response.ok) {
        console.error(`Content fetch failed with status: ${response.status}`)
        throw new Error('Failed to fetch content')
      }
      const data = await response.json()
      console.log(`Fetched ${data.length} content items for ${selectedSection}:`, 
        data.map((item: Content) => ({ key: item.key, language: item.language, type: item.type, content: item.content.substring(0, 30) })))
      
      // Filter data for the selected language and language-specific keys
      const currentLangItems = data.filter((item: Content) => item.language === selectedLang)
      const otherLangItems = data.filter((item: Content) => item.language !== selectedLang)
      
      console.log(`Items for ${selectedLang}:`, currentLangItems.length)
      console.log(`Items for other languages:`, otherLangItems.length)
      
      // Store all raw data for reference
      setRawContents(data)
      
      // Convert array to record by key
      const contentMap = data.reduce((acc: Record<string, Content>, item: Content) => {
        // For the current language, prioritize those items
        if (item.language === selectedLang) {
          console.log(`Processing ${selectedLang} item: ${item.key}, type: ${item.type}, content length: ${item.content?.length || 0}`)
          acc[item.key] = item
          
          // If this is a language-specific key (e.g., leftDescription_ja), also store under the base key
          if (item.key.endsWith(`_${selectedLang}`)) {
            const baseKey = item.key.slice(0, -3) // Remove _xx suffix
            console.log(`Also storing under base key: ${baseKey}`)
            acc[baseKey] = item
          }
        } else {
          // For other languages, only use as fallback if we don't have this content yet
          const baseKey = item.key.replace(/_[a-z]{2}$/, '')
          if (!acc[baseKey]) {
            console.log(`Using fallback for ${baseKey} from ${item.language}`)
            acc[baseKey] = item
          }
        }
        return acc
      }, {})
      
      console.log('Content map keys:', Object.keys(contentMap))
      // Just log the raw content map for debugging
      console.log('Raw content map:', contentMap)
      setContents(contentMap)
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  // Fetch content on mount and when language/section changes
  useEffect(() => {
    fetchContent()
  }, [selectedLang, selectedSection])

  // No duplicate function needed

  // Save content
  const saveContent = async (key: string, content: string, type: 'text' | 'richtext' | 'image') => {
    try {
      console.log(`Saving content for key: ${key} in language: ${selectedLang}`)
      
      // Find existing content with this exact key
      const existingWithExactKey = rawContents.find(item => 
        item.key === key && item.language === selectedLang
      );
      
      // Find existing content with base key (without language suffix)
      const baseKey = key.replace(/_[a-z]{2}$/, '');
      const existingWithBaseKey = rawContents.find(item => 
        item.key === baseKey && item.language === selectedLang
      );
      
      // Determine which existing item to update, if any
      const existing = existingWithExactKey || existingWithBaseKey || contents[key];
      const method = existing ? 'PUT' : 'POST';
      
      console.log(`Saving content for ${key}:`, {
        existing: existing ? existing.key : 'none',
        method,
        contentLength: content.length,
        type
      });
      
      const body = {
        pageId: 'home',
        section: selectedSection,
        language: selectedLang,
        key,
        content,
        type: type === 'richtext' ? 'html' : type,
        _id: existing?._id
      }

      const response = await fetch('/api/admin/content', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save error response:', errorText);
        throw new Error(`Failed to save content: ${response.status} ${errorText}`)
      }
      
      const savedContent = await response.json()
      console.log('Saved content:', savedContent);
      
      // Update the contents map
      setContents(prev => {
        const updated = { ...prev };
        updated[key] = savedContent;
        
        // If this is a language-specific key, also update the base key
        if (key.endsWith(`_${selectedLang}`)) {
          const baseKey = key.slice(0, -3); // Remove _xx suffix
          updated[baseKey] = savedContent;
        }
        
        return updated;
      })
      
      // Update the raw contents array
      setRawContents(prev => {
        // Remove any existing content with this key
        const filtered = prev.filter(item => 
          !(item.key === key && item.language === selectedLang)
        );
        // Add the new content
        return [...filtered, savedContent];
      })
      
      toast.success('Content saved')
      
      // Refresh all content to ensure everything is in sync
      fetchContent()
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    }
  }

  // Delete content
  const handleDelete = async (_id: string) => {
    try {
      const response = await fetch(`/api/admin/content?id=${_id}`, {
        method: 'DELETE',
        credentials: 'include' // Include cookies for authentication
      })

      if (!response.ok) throw new Error('Failed to delete content')

      // Remove from local state
      setContents(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(key => {
          if (next[key]._id === _id) delete next[key]
        })
        return next
      })

      toast.success('Content deleted')
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Failed to delete content')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={selectedSection} onValueChange={setSelectedSection} className="w-[600px]">
          <TabsList className="w-full justify-start">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="flex-1">
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={selectedLang} onValueChange={(value) => setSelectedLang(value as 'en' | 'ja')}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ja">Japanese</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-8">
        {SECTIONS.map((section) => (
          <div key={section.id} className={section.id === selectedSection ? '' : 'hidden'}>
            <Card>
              <CardHeader>
                <CardTitle>{section.label}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="text-sm font-medium">{field.label}</label>
                      {field.description && (
                        <span className="text-xs text-muted-foreground">{field.description}</span>
                      )}
                    </div>
                    {/* Debug logging for this field */}
                    {(() => {
                      // This is a self-executing function that logs but returns null to avoid rendering issues
                      console.log(`Field ${field.label} (${field.key}):`)
                      
                      // Find content in raw array
                      const contentItem = rawContents.find(item => item.key === field.key)
                      const langSpecificItem = rawContents.find(item => item.key === `${field.key}_${selectedLang}`)
                      
                      console.log(` - Raw content found: ${!!contentItem}`)
                      console.log(` - Raw lang specific content found: ${!!langSpecificItem}`)
                      console.log(` - Content from map: ${(contents[field.key]?.content || '').substring(0, 30)}`)
                      console.log(` - Content from raw: ${(contentItem?.content || '').substring(0, 30)}`)
                      
                      return null
                    })()}
                    
                    {(() => {
                      // Get the appropriate content for this field
                      const langSpecificKey = `${field.key}_${selectedLang}`;
                      const baseKey = field.key;
                      
                      // First try to find content with language-specific key
                      let contentItem = rawContents.find(item => 
                        item.key === langSpecificKey && item.language === selectedLang
                      );
                      
                      // If not found, try the base key with current language
                      if (!contentItem) {
                        contentItem = rawContents.find(item => 
                          item.key === baseKey && item.language === selectedLang
                        );
                      }
                      
                      // If still not found, try any language as fallback
                      if (!contentItem) {
                        contentItem = rawContents.find(item => 
                          item.key === baseKey || item.key === langSpecificKey
                        );
                      }
                      
                      // Get content value or empty string
                      const contentValue = contentItem?.content || '';
                      
                      // Debug
                      console.log(`Field ${field.key} content:`, {
                        langSpecificKey,
                        baseKey,
                        contentFound: !!contentItem,
                        contentKey: contentItem?.key,
                        contentLanguage: contentItem?.language,
                        contentPreview: contentValue.substring(0, 30)
                      });
                      
                      // Save key to use - use language suffix for non-English
                      const keyToSave = selectedLang === 'ja' ? langSpecificKey : baseKey;
                      
                      if (field.type === 'richtext') {
                        return (
                          <RichTextEditor
                            content={contentValue}
                            onChange={(content) => saveContent(keyToSave, content, 'richtext')}
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                          />
                        );
                      } else if (field.type === 'image') {
                        return (
                          <ImageUploader
                            value={contentValue}
                            onChange={(url) => saveContent(keyToSave, url, 'image')}
                            placeholder={`Enter ${field.label.toLowerCase()} URL...`}
                            folder={`ajwa/${selectedSection}`}
                          />
                        );
                      } else {
                        return (
                          <Input
                            type="text"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            className="w-full"
                            value={contentValue}
                            onChange={(e) => saveContent(keyToSave, e.target.value, 'text')}
                          />
                        );
                      }
                    })()}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

//                 <div className="space-y-2">
//                   <Label>Language</Label>
//                   <Select 
//                     onValueChange={(value) => register('language').onChange({ target: { value } })}
//                     defaultValue={selectedContent?.language || 'en'}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select language" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {LANGUAGE_OPTIONS.map(option => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Section</Label>
//                 <Select 
//                   onValueChange={(value) => register('section').onChange({ target: { value } })}
//                   defaultValue={selectedContent?.section}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select section" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {SECTION_OPTIONS.map(option => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Input
//                   placeholder="Page ID (e.g., home, about)"
//                   {...register('pageId')}
//                   className={errors.pageId ? 'border-red-500' : ''}
//                 />
//                 {errors.pageId && (
//                   <p className="text-red-500 text-sm">{errors.pageId.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Input
//                   placeholder="Section (e.g., hero, features)"
//                   {...register('section')}
//                   className={errors.section ? 'border-red-500' : ''}
//                 />
//                 {errors.section && (
//                   <p className="text-red-500 text-sm">{errors.section.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Input
//                   placeholder="Key (e.g., title, description)"
//                   {...register('key')}
//                   className={errors.key ? 'border-red-500' : ''}
//                 />
//                 {errors.key && (
//                   <p className="text-red-500 text-sm">{errors.key.message}</p>
//                 )}
//               </div>

//               <Select 
//                 onValueChange={(value) => register('type').onChange({ target: { value } })}
//                 defaultValue={selectedContent?.type}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select content type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="text">Text</SelectItem>
//                   <SelectItem value="image">Image</SelectItem>
//                   <SelectItem value="html">HTML</SelectItem>
//                 </SelectContent>
//               </Select>

//               <div className="space-y-2">
//                 <Textarea
//                   placeholder="Content"
//                   {...register('content')}
//                   className={errors.content ? 'border-red-500' : ''}
//                   rows={5}
//                 />
//                 {errors.content && (
//                   <p className="text-red-500 text-sm">{errors.content.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Input
//                   type="number"
//                   placeholder="Order (optional)"
//                   {...register('order', { valueAsNumber: true })}
//                 />
//               </div>

//               <div className="flex justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => {
//                     setSelectedContent(null)
//                     setIsDialogOpen(false)
//                     reset()
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={loading}>
//                   {selectedContent ? 'Update' : 'Add'} Content
//                 </Button>
//               </div>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-8">
//         {SECTION_OPTIONS.map((section) => (
//           <Card key={section.value}>
//             <CardHeader>
//               <CardTitle>{section.label}</CardTitle>
//               <CardDescription>
//                 Manage content for the {section.label.toLowerCase()}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid gap-4">
//                 {LANGUAGE_OPTIONS.map((lang) => {
//                   const sectionContents = groupedContents[`${section.value}-${lang.value}`] || []
//                   return (
//                     <div key={lang.value} className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <h3 className="text-sm font-medium text-slate-500">{lang.label}</h3>
//                         <Badge variant="secondary">{sectionContents.length} items</Badge>
//                       </div>
//                       <div className="grid gap-4">
//                         {sectionContents.map((content) => (
//                           <Card key={content._id}>
//                             <CardHeader>
//                               <CardTitle className="text-lg flex items-center justify-between">
//                                 <span>{content.key}</span>
//                                 <div className="flex gap-2">
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={() => {
//                                       setSelectedContent(content)
//                                       setIsDialogOpen(true)
//                                     }}
//                                   >
//                                     <Pencil className="h-4 w-4" />
//                                   </Button>
//                                   <Button
//                                     size="sm"
//                                     variant="destructive"
//                                     onClick={() => handleDelete(content._id)}
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </CardTitle>
//                               <CardDescription>
//                                 {content.pageId} / {content.section}
//                               </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                               {content.type === 'image' ? (
//                                 <img
//                                   src={content.content}
//                                   alt={content.key}
//                                   className="max-h-40 object-contain"
//                                 />
//                               ) : content.type === 'html' ? (
//                                 <div
//                                   dangerouslySetInnerHTML={{ __html: content.content }}
//                                   className="prose max-w-none dark:prose-invert"
//                                 />
//                               ) : (
//                                 <p className="whitespace-pre-wrap">{content.content}</p>
//                               )}
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
