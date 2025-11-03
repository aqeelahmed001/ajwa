import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Permission {
  name: string;
  description: string;
  key: string;
}

export interface Role {
  id: string;
  name: string;
  slug?: string; // URL-friendly version of the name
  description?: string;
  permissions: string[]; // Array of permission keys
  isSystem: boolean; // System roles cannot be deleted
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleDocument extends Document, Omit<Role, 'id'> {
  // Document adds _id automatically
}

const RoleSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      // Generate slug from name if not provided
      default: function() {
        return this.name?.toLowerCase().replace(/\s+/g, '-') || null;
      }
    },
    description: { 
      type: String,
      trim: true
    },
    permissions: [{ 
      type: String,
      required: true
    }],
    isSystem: {
      type: Boolean,
      default: false
    }
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
RoleSchema.index({ name: 1 }, { unique: true });
RoleSchema.index({ slug: 1 }, { unique: true });
RoleSchema.index({ isSystem: 1 });

// Check if the model exists before creating a new one
const Role = (mongoose.models.Role as Model<RoleDocument>) || 
  mongoose.model<RoleDocument>('Role', RoleSchema);

export default Role;
