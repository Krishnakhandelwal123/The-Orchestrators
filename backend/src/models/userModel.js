import mongoose from 'mongoose'

const CreatorProfileSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  bio: { type: String, required: true },
  category: {
    type: String,
    enum: ['Developer', 'Data Scientist', 'Designer', 'Other'],
    required: true
  },
  avatar: { type: String }, 
  coverImage: { type: String },
  socialLinks: {
    github: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    website: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: function () {
      return this.authMethod === 'password';
    }
  },

  profileImage: {
    type: String,
    default: ''
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  authMethod: {
    type: String,
    enum: ['password', 'google'],
    required: true,
    default: 'password'
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  VerificationCodeExpires: Date,
  VerificationCode: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // Roles
  roles: {
    isSupporter: { type: Boolean, default: true },
    isCreator: { type: Boolean, default: false }
  },

  // Creator profile (only if they become a creator)
  creatorProfile: {
    type: CreatorProfileSchema,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', UserSchema);
