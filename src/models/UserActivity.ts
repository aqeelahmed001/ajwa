import mongoose, { Schema, Document, Model } from 'mongoose';

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
}

export interface UserActivityDocument extends Document, Omit<UserActivity, 'id'> {
  // Document adds _id automatically
}

const UserActivitySchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    action: { 
      type: String, 
      required: true,
      enum: [
        'login', 
        'logout', 
        'create_user', 
        'update_user', 
        'delete_user', 
        'create_role',
        'update_role',
        'delete_role',
        'assign_role',
        'create_content',
        'update_content',
        'delete_content',
        'publish_content',
        'unpublish_content',
        'view_sensitive_data',
        'export_data',
        'settings_change',
        'password_change',
        'password_reset',
        'failed_login',
        'view_users',
        'view_roles',
        'view_categories',
        'view_content'
      ]
    },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id.toString();
        if (ret._id) delete ret._id;
        if (ret.__v !== undefined) delete ret.__v;
      }
    }
  }
);

// Create indexes for faster queries
UserActivitySchema.index({ userId: 1 });
UserActivitySchema.index({ action: 1 });
UserActivitySchema.index({ createdAt: -1 });
UserActivitySchema.index({ ipAddress: 1 });

// Check if the model exists before creating a new one
const UserActivity = (mongoose.models.UserActivity as Model<UserActivityDocument>) || 
  mongoose.model<UserActivityDocument>('UserActivity', UserActivitySchema);

export default UserActivity;
