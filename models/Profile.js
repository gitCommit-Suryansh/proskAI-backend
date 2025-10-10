import mongoose from "mongoose";

// Unchanged sub-schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  { _id: false }
);

// ✨ NEW: Sub-schema for social and portfolio links
const socialLinksSchema = new mongoose.Schema(
  {
    portfolio: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
  { _id: false }
);

// Unchanged sub-schema
const educationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
  },
  { _id: false }
);

// 🔄 UPDATED: Experience schema now includes experienceType
const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    experienceType: {
      type: String,
      required: true,
      enum: ["Job", "Internship", "Apprenticeship", "Freelance"],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
  },
  { _id: false }
);

// 🔄 UPDATED: Project schema now has separate links for GitHub and Live Demo
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    technologies: [String],
    githubLink: { type: String, trim: true },
    liveDemoLink: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

// Unchanged sub-schema
const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String },
    credentialUrl: { type: String },
  },
  { _id: false }
);

// --- MAIN PROFILE SCHEMA ---
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileName: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    // ✨ NEW: Added subscription status
    subscription: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    // --- Main Details Object (Restructured for clarity) ---
    details: {
      // 🧍 Personal Information
      personalInfo: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        gender: {
          type: String,
          enum: ["Male", "Female", "Other", "Prefer not to say"],
        },
        nationality: { type: String, trim: true },
        disability: { type: String, trim: true }, // Flexible for user description
      },

      // 📞 Contact Information
      contactInfo: {
        email: { type: String, required: true },
        phone: { type: String },
        presentAddress: addressSchema,
        socials: socialLinksSchema,
      },

      // 💼 Career Summary
      careerSummary: {
        totalExperienceInYears: { type: Number, min: 0 },
        skills: [String],
        experience: [experienceSchema],
        education: [educationSchema],
        projects: [projectSchema],
        certifications: [certificationSchema],
        achievements: [String], // Simple array of strings
      },

      // 🎯 Job Preferences
      jobPreferences: {
        jobType: {
          type: String,
          enum: ["Remote", "Onsite", "Hybrid"],
        },
        preferredLocations: [String],
        currentCTC: { type: String, trim: true }, // String to handle currency/lakhs etc.
        expectedCTC: { type: String, trim: true },
        willingToRelocate: { type: Boolean, default: false },
        visaRequired: { type: Boolean, default: false },
        noticePeriod: {
          available: { type: Boolean, default: false },
          durationInDays: { type: Number },
        },
      },
    },
  },
  { timestamps: true }
);

// Index for faster querying by user
profileSchema.index({ userId: 1 });

export default mongoose.model("Profile", profileSchema);