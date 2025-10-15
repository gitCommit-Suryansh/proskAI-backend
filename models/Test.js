import mongoose from "mongoose";

// --- SUB-SCHEMAS (for arrays) ---
// These are still needed to define the shape of objects inside the arrays.

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String },
  fieldOfStudy: { type: String },
  grade: { type: String },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  experienceType: { type: String, required: true, enum: ["Job", "Internship", "Apprenticeship", "Freelance"] },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  description: { type: String },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  technologies: [String],
  githubLink: { type: String, trim: true },
  liveDemoLink: { type: String, trim: true },
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  credentialId: { type: String },
  credentialUrl: { type: String },
}, { _id: false });

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  proficiency: { type: String, enum: ["Basic", "Conversational", "Fluent", "Native"] },
}, { _id: false });

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, trim: true },
  description: { type: String, trim: true },
}, { _id: false });


// --- MAIN FLATTENED PROFILE SCHEMA ---
const profileSchema = new mongoose.Schema(
  {
    // --- Core Info ---
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profileName: { type: String, required: true, trim: true },
    resumeUrl: { type: String, trim: true },
    subscription: { type: String, enum: ["Free", "Premium"], default: "Free" },

    // --- Personal Info (Flattened) ---
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    pronouns: { type: String, trim: true },

    // --- Demographics (Flattened) ---
    gender: { type: String, enum: ["Male", "Female", "Non-binary", "Other", "Prefer not to say"] },
    ethnicity: { type: String, trim: true },
    race: { type: String, trim: true },
    disabilityStatus: { type: String, enum: ["Yes", "No", "Prefer not to say"] },
    veteranStatus: { type: String, enum: ["Yes", "No", "Prefer not to say"] },
    
    // --- Contact Info (Flattened) ---
    email: { type: String, required: true },
    phoneCountryCode: { type: String, trim: true, default: "+91" },
    phone: { type: String },
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
    otherSocialLink: { type: String, trim: true },

    // --- Work Authorization (Flattened) ---
    nationality: { type: String, trim: true },
    usAuthorized: { type: Boolean },
    sponsorshipRequired: { type: Boolean },
    citizenshipStatus: { type: String, trim: true },
    
    // --- Job Preferences (Flattened) ---
    jobType: { type: String, enum: ["Remote", "Onsite", "Hybrid"] },
    preferredLocations: [String],
    currentCTC: { type: String, trim: true },
    expectedCTC: { type: String, trim: true },
    willingToRelocate: { type: Boolean, default: false },
    noticePeriodAvailable: { type: Boolean, default: false },
    noticePeriodDurationInDays: { type: Number },

    // --- Career Summary (Arrays remain as they are) ---
    totalExperienceInYears: { type: Number, min: 0 },
    skills: [String],
    achievements: [String],
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    publications: [publicationSchema],
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 });

export default mongoose.model("DemoProfile", profileSchema);