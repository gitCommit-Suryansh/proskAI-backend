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

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
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
    link: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

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
    details: {
      fullName: { type: String, required: true },
      email: { type: String },
      phone: { type: String },
      address: addressSchema,

      skills: [String],

      experience: [experienceSchema],

      education: [educationSchema],

      projects: [projectSchema],

      certifications: [certificationSchema],

      // 🔮 Optional: job preferences for autofill optimization
      jobPreferences: {
        jobType: {
          type: String,
          enum: ["remote", "onsite", "hybrid"],
        },
        preferredLocations: [String],
        expectedSalary: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Index for faster querying by user
profileSchema.index({ userId: 1 });

export default mongoose.model("Profile", profileSchema);
