import { Schema, model, models } from 'mongoose';

export interface IContent {
  _id: string;
  pageId: string;
  section: 'hero' | 'content' | 'category' | 'intro' | 'cta' | 'brands' | 'listings' | 'faq' | 'header' | 'footer';
  language: 'en' | 'ja';
  type: 'text' | 'image' | 'html';
  content: string;
  key: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    pageId: { type: String, required: true },
    section: { 
      type: String, 
      enum: ['hero', 'content', 'category', 'intro', 'cta', 'brands', 'listings', 'faq', 'header', 'footer'],
      required: true 
    },
    language: { 
      type: String, 
      enum: ['en', 'ja'],
      required: true 
    },
    type: { type: String, enum: ['text', 'image', 'html'], required: true },
    content: { type: String, required: true },
    key: { type: String, required: true },
    order: { type: Number },
  },
  { timestamps: true }
);

// Create a compound index for efficient querying
contentSchema.index({ pageId: 1, section: 1, language: 1, key: 1 }, { unique: true });

export const Content = models.Content || model('Content', contentSchema);
