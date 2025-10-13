import mongoose, { Schema, Document, Model } from 'mongoose';
import { slugify } from '@/lib/slugify';

export interface Specification {
  [key: string]: string;
}

export interface MachineryItem {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  category: string;
  subcategory?: string;
  manufacturer: string;
  modelNumber: string;
  year: number;
  hours: number;
  price: number;
  priceFormatted?: string;
  priceJPY?: string;
  images: string[];
  location: string;
  condition: string;
  weight?: string;
  featured: boolean;
  availability: string;
  description: string;
  specifications: Specification;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Avoid naming conflict with the 'model' property by using a type intersection instead of extends
export type MachineryItemDocument = Document & {
  slug: string;
  categorySlug: string;
  name: string;
  category: string;
  subcategory?: string;
  manufacturer: string;
  modelNumber: string; // Field for the model number of the machinery
  year: number;
  hours: number;
  price: number;
  priceFormatted?: string;
  priceJPY?: string;
  images: string[];
  location: string;
  condition: string;
  weight?: string;
  featured: boolean;
  availability: string;
  description: string;
  specifications: Record<string, string>;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MachineryItemModel extends Model<MachineryItemDocument> {
  findByCategory(category: string): Promise<MachineryItemDocument[]>;
  findFeatured(): Promise<MachineryItemDocument[]>;
}

const MachineryItemSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    subcategory: { type: String },
    manufacturer: { type: String, required: true },
    modelNumber: { type: String, required: true },
    year: { type: Number, required: true },
    hours: { type: Number, required: true },
    price: { type: Number, required: true },
    priceFormatted: { type: String },
    priceJPY: { type: String },
    images: [{ type: String }],
    location: { type: String, required: true },
    condition: { type: String, required: true },
    weight: { type: String },
    featured: { type: Boolean, default: false },
    availability: { type: String, required: true },
    description: { type: String, required: true },
    specifications: { type: Map, of: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Ensure slugs exist prior to validation
MachineryItemSchema.pre('validate', function(this: MachineryItemDocument, next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name);
  }

  if (this.isModified('category') || this.isNew) {
    this.categorySlug = slugify(this.category);
  }

  next();
});

// Create and format price strings before saving
MachineryItemSchema.pre('save', function(this: MachineryItemDocument, next) {
  if (this.price) {
    this.priceFormatted = `$${this.price.toLocaleString()}`;
    const jpyPrice = this.price * 110;
    this.priceJPY = `¥${jpyPrice.toLocaleString()}`;
  }

  next();
});

MachineryItemSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (!update) {
    return next();
  }

  const set = update.$set ? update.$set : update;

  if (set.name) {
    set.slug = slugify(set.name);
  }

  if (set.category) {
    set.categorySlug = slugify(set.category);
  }

  if (set.price) {
    const priceValue = Number(set.price);
    if (!Number.isNaN(priceValue) && priceValue > 0) {
      set.priceFormatted = `$${priceValue.toLocaleString()}`;
      const jpyPrice = priceValue * 110;
      set.priceJPY = `¥${jpyPrice.toLocaleString()}`;
    }
  }

  next();
});

MachineryItemSchema.index({ categorySlug: 1, slug: 1 }, { unique: true });

// Static method to find machinery items by category
MachineryItemSchema.statics.findByCategory = function(category: string) {
  return this.find({ category });
};

// Static method to find featured machinery items
MachineryItemSchema.statics.findFeatured = function() {
  return this.find({ featured: true });
};

// Check if the model exists before creating a new one
const MachineryItem = (mongoose.models.MachineryItem as MachineryItemModel) || 
  mongoose.model<MachineryItemDocument, MachineryItemModel>('MachineryItem', MachineryItemSchema);

export default MachineryItem;
