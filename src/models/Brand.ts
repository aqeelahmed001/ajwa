import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Brand {
  id: string;
  name: string;
  logo: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BrandDocument extends Document, Omit<Brand, 'id'> {
  // Document adds _id automatically
}

const BrandSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        if (ret._id) delete ret._id;
        if (ret.__v !== undefined) delete ret.__v;
      }
    }
  }
);

// Create indexes for faster queries
BrandSchema.index({ order: 1 });
BrandSchema.index({ isActive: 1 });

// Check if the model exists before creating a new one
const Brand = (mongoose.models.Brand as Model<BrandDocument>) || 
  mongoose.model<BrandDocument>('Brand', BrandSchema);

export default Brand;
