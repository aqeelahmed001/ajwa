import mongoose, { Document, Schema } from 'mongoose';

export interface MachineryOption {
  type: string;  // 'category', 'subcategory', 'condition', 'availability'
  value: string;
  count: number; // How many machinery items use this option
  createdAt: Date;
  updatedAt: Date;
}

export interface MachineryOptionDocument extends MachineryOption, Document {}

const MachineryOptionSchema = new Schema<MachineryOptionDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ['category', 'subcategory', 'condition', 'availability']
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create a compound index for type and value to ensure uniqueness
MachineryOptionSchema.index({ type: 1, value: 1 }, { unique: true });

// Create the model or get it if it already exists
const MachineryOptionModel = mongoose.models.MachineryOption as mongoose.Model<MachineryOptionDocument> || 
  mongoose.model<MachineryOptionDocument>('MachineryOption', MachineryOptionSchema);

export default MachineryOptionModel;
