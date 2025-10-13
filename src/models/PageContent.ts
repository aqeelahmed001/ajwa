// This is a TypeScript interface for the Page Content model
// In a real application, you would use a database ORM like Mongoose or Prisma

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'hero' | 'gallery' | 'cta' | 'feature';
  title?: {
    en: string;
    ja: string;
  };
  subtitle?: {
    en: string;
    ja: string;
  };
  content?: {
    en: string;
    ja: string;
  };
  image?: string;
  images?: string[];
  link?: string;
  buttonText?: {
    en: string;
    ja: string;
  };
  order: number;
}

export interface PageContent {
  id: string;
  slug: string;
  title: {
    en: string;
    ja: string;
  };
  description?: {
    en: string;
    ja: string;
  };
  blocks: ContentBlock[];
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Example MongoDB Schema (if using Mongoose)
/*
import mongoose, { Schema, Document } from 'mongoose';

export interface PageContentDocument extends Document, Omit<PageContent, 'id'> {
  // Document adds _id automatically
}

const ContentBlockSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'image', 'hero', 'gallery', 'cta', 'feature']
  },
  title: {
    en: { type: String },
    ja: { type: String }
  },
  subtitle: {
    en: { type: String },
    ja: { type: String }
  },
  content: {
    en: { type: String },
    ja: { type: String }
  },
  image: { type: String },
  images: [{ type: String }],
  link: { type: String },
  buttonText: {
    en: { type: String },
    ja: { type: String }
  },
  order: { type: Number, required: true }
});

const PageContentSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: {
      en: { type: String, required: true },
      ja: { type: String, required: true }
    },
    description: {
      en: { type: String },
      ja: { type: String }
    },
    blocks: [ContentBlockSchema],
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.PageContent || 
  mongoose.model<PageContentDocument>('PageContent', PageContentSchema);
*/
