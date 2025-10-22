// models/Keyword.js
import mongoose from "mongoose";

const KeywordSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  profileId:  { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true, unique: true, index: true },
  keywords: {
    skills:        [String],
    tools:         [String],
    education:     [String],
    experience:    [String],
    certifications:[String],
    languages:     [String],
    locations:     [String],
    extras:        [String],
    all:           [String]   // union of all categories
  },
  sourceHashes: {
    profileUpdatedAt: Date,
  },
}, { timestamps: true });

export default mongoose.model("Keyword", KeywordSchema);