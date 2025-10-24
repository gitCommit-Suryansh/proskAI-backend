import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 

let pdf = require("pdf-parse"); 
const mammoth = require("mammoth");

if (pdf && pdf.default) {
  pdf = pdf.default;
}

// ... rest of your controller code (uploadResume, parseResume, etc.) ...

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

// --- (All your helper functions: extractEmail, extractPhone, etc. are correct) ---
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
    const parts = namePart.split(/[._-]/);
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
    const skillsRegex = /(?:Skills|Technical Skills|Proficiencies)[\n\s:]+((?:.|\n)+?)(?=\n\n(?:Education|Experience|Projects|Certifications)|$)/i;
    const match = text.match(skillsRegex);
    if (!match || !match[1]) return [];
    const skillsText = match[1];
    const skills = skillsText.split(/[\n,•-]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 50);
    return [...new Set(skills)];
  } catch (e) {
    return [];
  }
}

function parseResumeText(text) {
  const email = extractEmail(text);
  const name = extractNameFromEmail(email);

  return {
    firstName: name.firstName,
    lastName: name.lastName,
    pronouns: "",
    gender: "Prefer not to say",
    ethnicity: "",
    race: "",
    disabilityStatus: "Prefer not to say",
    veteranStatus: "Prefer not to say",
    email: email,
    phoneCountryCode: "+1",
    phone: extractPhone(text),
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    portfolio: "",
    linkedin: extractLinkedIn(text),
    github: extractGithub(text),
    otherSocialLink: "",
    nationality: "",
    usAuthorized: null,
    sponsorshipRequired: null,
    citizenshipStatus: "",
    jobType: "Remote",
    preferredLocations: [],
    currentCTC: "",
    expectedCTC: "",
    willingToRelocate: false,
    noticePeriodAvailable: false,
    noticePeriodDurationInDays: "",
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

export const parseResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No resume file uploaded." });
  }

  try {
    let rawText = "";

    if (req.file.mimetype === "application/pdf") {
      // This call will now work correctly
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

    const parsedData = parseResumeText(rawText);

    res.status(200).json({
      message: "Resume parsed successfully!",
      parsedData: parsedData,
    });

  } catch (err) {
    console.error("Resume parsing failed:", err.message);
    res.status(500).json({ message: `Failed to parse resume: ${err.message}` });
  }
};

