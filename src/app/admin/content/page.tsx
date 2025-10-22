import { Content } from '@/components/admin/content/Content';

export default function ContentPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      <Content />
    </div>
  );
}
