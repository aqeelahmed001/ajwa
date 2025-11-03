import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'editor' | 'viewer' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // This will be hashed
  role: UserRole;
  roleId?: string; // Reference to Role model
  isActive: boolean;
  image?: string; // Profile image URL
  lastLogin?: Date;
  lastLoginIp?: string;
  failedLoginAttempts?: number;
  lockedUntil?: Date;
  createdBy?: string; // Reference to User who created this user
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends Document, Omit<User, 'id' | 'password'> {
  // Document adds _id automatically
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      required: true, 
      default: 'viewer'
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    isActive: { type: Boolean, default: true },
    image: { type: String },
    lastLogin: { type: Date },
    lastLoginIp: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
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
        if (ret.password) delete ret.password; // Don't expose password hash
      }
    }
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email });
};

// Create indexes for faster queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ roleId: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdBy: 1 });

// Check if the model exists before creating a new one
const User = (mongoose.models.User as UserModel) || 
  mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
