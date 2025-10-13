import mongoose from "mongoose";

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

// 🔄 UPDATED: Added 'other' for miscellaneous links
const socialLinksSchema = new mongoose.Schema(
  {
    portfolio: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
    other: { type: String, trim: true },
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

const languageSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ["Basic", "Conversational", "Fluent", "Native"],
    },
  },
  { _id: false }
);

// ✨ NEW: Publication Sub-Schema
const publicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, trim: true },
    description: { type: String, trim: true },
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
    profileName: { type: String, required: true, trim: true },
    resumeUrl: { type: String, trim: true },
    subscription: {
      type: String,
      enum: ["Free", "Premium"],
      default: "Free",
    },

    // --- Main Details Object ---
    details: {
      // 🧍 Personal Information
      personalInfo: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        pronouns: { type: String, trim: true }, // e.g., he/him

        // ✨ NEW: Demographic information (often optional for legal reasons)
        demographics: {
          gender: { type: String, enum: ["Male", "Female", "Non-binary", "Other", "Prefer not to say"] },
          ethnicity: { type: String, trim: true },
          race: { type: String, trim: true },
          disabilityStatus: { type: String, enum: ["Yes", "No", "Prefer not to say"] },
          veteranStatus: { type: String, enum: ["Yes", "No", "Prefer not to say"] },
        },
      },

      // 📞 Contact Information
      contactInfo: {
        email: { type: String, required: true },
        phoneCountryCode: { type: String, trim: true, default: "+91" },
        phone: { type: String },
        presentAddress: addressSchema,
        socials: socialLinksSchema,
      },

      // ✨ NEW: Work Authorization Details
      workAuthorization: {
        nationality: { type: String, trim: true },
        usAuthorized: { type: Boolean },
        sponsorshipRequired: { type: Boolean },
        citizenshipStatus: { type: String, trim: true },
      },

      // 💼 Career Summary
      careerSummary: {
        totalExperienceInYears: { type: Number, min: 0 },
        skills: [String],
        experience: [experienceSchema],
        education: [educationSchema],
        projects: [projectSchema],
        certifications: [certificationSchema],
        achievements: [String],
        languages: [languageSchema],
        publications: [publicationSchema],
      },

      // 🎯 Job Preferences
      jobPreferences: {
        jobType: { type: String, enum: ["Remote", "Onsite", "Hybrid"] },
        preferredLocations: [String],
        currentCTC: { type: String, trim: true },
        expectedCTC: { type: String, trim: true },
        willingToRelocate: { type: Boolean, default: false },
        noticePeriod: {
          available: { type: Boolean, default: false },
          durationInDays: { type: Number },
        },
      },
    },
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 });

export default mongoose.model("Profile", profileSchema);
