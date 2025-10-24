import mongoose from "mongoose";

const KeywordSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true, index: true },
    // single, flat list of keywords for this profile
    keywords:  { type: [String], default: [] }
  },
  { timestamps: true }
);

// per-user per-profile unique
KeywordSchema.index({ userId: 1, profileId: 1 }, { unique: true });

// normalize to lowercase + dedupe on save
KeywordSchema.pre("save", function(next) {
  const arr = Array.isArray(this.keywords) ? this.keywords : [];
  const norm = arr
    .map(s => String(s || "").trim().toLowerCase())
    .filter(Boolean);
  this.keywords = Array.from(new Set(norm));
  next();
});

export default mongoose.model("Keyword", KeywordSchema);