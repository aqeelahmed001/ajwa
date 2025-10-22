"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IContent } from '@/models/content';

const contentSchema = z.object({
  pageId: z.string().min(1, 'Page ID is required'),
  section: z.string().min(1, 'Section is required'),
  type: z.enum(['text', 'image', 'html']),
  content: z.string().min(1, 'Content is required'),
  key: z.string().min(1, 'Key is required'),
  order: z.number().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

export function Content() {
  const [contents, setContents] = useState<IContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<IContent | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

  const fetchContents = async (pageId?: string, section?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (pageId) params.append('pageId', pageId);
      if (section) params.append('section', section);

      const response = await fetch(`/api/admin/content?${params}`);
      const data = await response.json();
      setContents(data);
    } catch (error) {
      toast.error('Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    try {
      setLoading(true);
      const url = '/api/admin/content';
      const method = selectedContent ? 'PUT' : 'POST';
      const body = selectedContent ? { ...data, id: selectedContent._id } : data;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save content');

      toast.success('Content saved successfully');
      reset();
      setSelectedContent(null);
      fetchContents();
    } catch (error) {
      toast.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/content?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete content');

      toast.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      toast.error('Failed to delete content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedContent ? 'Edit Content' : 'Add New Content'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                placeholder="Page ID"
                {...register('pageId')}
                className={errors.pageId ? 'border-red-500' : ''}
              />
              {errors.pageId && (
                <p className="text-red-500 text-sm mt-1">{errors.pageId.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Section"
                {...register('section')}
                className={errors.section ? 'border-red-500' : ''}
              />
              {errors.section && (
                <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Key"
                {...register('key')}
                className={errors.key ? 'border-red-500' : ''}
              />
              {errors.key && (
                <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
              )}
            </div>

            <Select 
              onValueChange={(value) => register('type').onChange({ target: { value } })}
              defaultValue={selectedContent?.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Textarea
                placeholder="Content"
                {...register('content')}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            <div>
              <Input
                type="number"
                placeholder="Order (optional)"
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {selectedContent ? 'Update' : 'Add'} Content
              </Button>
              {selectedContent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedContent(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Filter by Page ID"
              onChange={(e) => fetchContents(e.target.value)}
            />
            <Input
              placeholder="Filter by Section"
              onChange={(e) => fetchContents(undefined, e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {contents.map((content) => (
              <Card key={content._id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{content.key}</p>
                      <p className="text-sm text-gray-500">
                        {content.pageId} / {content.section}
                      </p>
                      <p className="mt-2 text-sm">{content.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedContent(content)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(content._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
