import mongoose, { Document, Schema } from 'mongoose';
import { slugify } from '@/lib/slugify';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryDocument extends Omit<Category, 'id'>, Document {
  // Document already includes _id which is transformed to id
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      // Remove unique: true here since we're defining it in the index below
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Generate slug from name
CategorySchema.pre('validate', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name);
  }
  next();
});

// Handle slug generation for updates
CategorySchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  if (!update) {
    return next();
  }

  const set = update.$set ? update.$set : update;

  if (set.name) {
    set.slug = slugify(set.name);
  }

  next();
});

// Create indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ order: 1 });

// Create the model or get it if it already exists
const CategoryModel = mongoose.models.Category as mongoose.Model<CategoryDocument> || 
  mongoose.model<CategoryDocument>('Category', CategorySchema);

export default CategoryModel;
