if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixMock {
    constructor(init) {
      if (init) {
        Object.assign(this, init);
      }
    }
    translate() { return new DOMMatrixMock(); }
    scale() { return new DOMMatrixMock(); }
    // Add other stub methods if pdf-parse needs them, but this is often enough.
  }
  globalThis.DOMMatrix = DOMMatrixMock;
}
import cloudinary from '../config/cloudinary.js'; // ✅ FIXED: Correct path to your config
import streamifier from 'streamifier';

import { createRequire } from "module"; // ✨ NEW: Import createRequire
const require = createRequire(import.meta.url); // ✨ NEW: Create a require function

const pdf = require("pdf-parse"); // ✨ FIXED: Use require for CommonJS
const mammoth = require("mammoth");

export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "RESUMES",
            public_id: `resume_${req.user._id}_${Date.now()}`,
            resource_type: "auto"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadStream(req.file.buffer);

    res.status(200).json({
      message: "Resume uploaded successfully!",
      resumeUrl: result.secure_url,
    });

  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    res.status(500).json({ message: "File upload failed." });
  }
};

function extractEmail(text) {
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const match = text.match(emailRegex);
  return match ? match[0] : "";
}

function extractPhone(text) {
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g;
  const match = text.match(phoneRegex);
  return match ? match[0] : "";
}

function extractNameFromEmail(email) {
  if (!email) return { firstName: "", lastName: "" };
  try {
    const namePart = email.split('@')[0];
    const parts = namePart.split(/[._-]/); // Split by common separators
    const firstName = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : "";
    const lastName = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : "";
    return { firstName, lastName };
  } catch (e) {
    return { firstName: "", lastName: "" };
  }
}

function extractLinkedIn(text) {
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const match = text.match(linkedinRegex);
  return match ? `https://${match[0]}` : "";
}

function extractGithub(text) {
  const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/i;
  const match = text.match(githubRegex);
  return match ? `https://${match[0]}` : "";
}

function extractSkills(text) {
  try {
    // Find the text between a "Skills" heading and the next heading
    const skillsRegex = /(?:Skills|Technical Skills|Proficiencies)[\n\s:]+((?:.|\n)+?)(?=\n\n(?:Education|Experience|Projects|Certifications)|$)/i;
    const match = text.match(skillsRegex);
    if (!match || !match[1]) return [];
    
    // Split the skills block by commas, newlines, or bullet points
    const skillsText = match[1];
    const skills = skillsText
      .split(/[\n,•-]/) // Split by newlines, commas, or bullets
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 50); // Filter out empty strings or noise
    
    return [...new Set(skills)]; // Return unique skills
  } catch (e) {
    return [];
  }
}


function parseResumeText(text) {
  const email = extractEmail(text);
  const name = extractNameFromEmail(email);

  return {
    // Personal Info
    firstName: name.firstName,
    lastName: name.lastName,
    pronouns: "",

    // Demographics (Cannot be reliably parsed)
    gender: "Prefer not to say",
    ethnicity: "",
    race: "",
    disabilityStatus: "Prefer not to say",
    veteranStatus: "Prefer not to say",
    
    // Contact Info
    email: email,
    phoneCountryCode: "+1", // Default, hard to parse
    phone: extractPhone(text),
    street: "", // Address parsing is extremely unreliable
    city: "",
    state: "",
    country: "",
    zipCode: "",
    portfolio: "", // Use regex for "portfolio" or "website" if needed
    linkedin: extractLinkedIn(text),
    github: extractGithub(text),
    otherSocialLink: "",

    // Work Authorization (Cannot be reliably parsed)
    nationality: "",
    usAuthorized: null,
    sponsorshipRequired: null,
    citizenshipStatus: "",
    
    // Job Preferences (Cannot be parsed)
    jobType: "Remote",
    preferredLocations: [],
    currentCTC: "",
    expectedCTC: "",
    willingToRelocate: false,
    noticePeriodAvailable: false,
    noticePeriodDurationInDays: "",

    // Career Summary
    totalExperienceInYears: null,
    skills: extractSkills(text),
    achievements: [],

    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    publications: [],
  };
}


// ✨ NEW: Controller for parsing a resume
export const parseResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No resume file uploaded." });
  }

  try {
    let rawText = "";

    // 1. EXTRACT RAW TEXT
    if (req.file.mimetype === "application/pdf") {
      const data = await pdf(req.file.buffer);
      rawText = data.text;
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = result.value;
    } else {
      return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or DOCX." });
    }
    
    if (!rawText) {
      throw new Error("Could not extract text from the file.");
    }

    // 2. PARSE THE RAW TEXT
    const parsedData = parseResumeText(rawText);

    // 3. RETURN STRUCTURED JSON
    res.status(200).json({
      message: "Resume parsed successfully!",
      parsedData: parsedData,
    });

  } catch (err) {
    console.error("Resume parsing failed:", err.message);
    res.status(500).json({ message: `Failed to parse resume: ${err.message}` });
  }
};