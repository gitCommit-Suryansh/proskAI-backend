import Keyword from "../models/Keyword.js";

export const addDemoKeywords = async (req, res) => {
    try {
      // This is the hardcoded data you provided
      const demoData = {
        userId: req.user._id, // Use the ID of the logged-in user
        profileId: "68f75c4690c87a9ef4304577", // Using the example Profile ID
        keywords: {
          skills: ["javascript", "typescript", "react", "node.js", "express", "aws", "mongodb", "html", "css", "git"],
          tools: ["jira", "figma", "docker", "jenkins", "postman", "swagger"],
          education: ["bachelor", "computer science", "engineering", "degree"],
          experience: ["frontend developer", "backend developer", "full stack engineer", "software engineer", "devops", "intern"],
          certifications: ["aws certified developer", "google cloud engineer"],
          languages: ["english", "hindi"],
          locations: ["bangalore", "india", "remote"],
          extras: ["leadership", "teamwork", "problem solving", "communication"],
          all: ["javascript", "typescript", "react", "node.js", "express", "aws", "mongodb", "html", "css", "git", "jira", "figma", "docker", "jenkins", "postman", "swagger", "bachelor", "computer science", "engineering", "frontend developer", "backend developer", "full stack engineer", "software engineer", "devops", "intern", "aws certified developer", "google cloud engineer", "english", "hindi", "bangalore", "india", "remote", "leadership", "teamwork", "problem solving", "communication"]
        },
        sourceHashes: {
          profileUpdatedAt: new Date("2025-10-22T00:00:00.000Z"),
        },
      };
  
      // Check if one already exists for this profileId, to avoid duplicates
      const existing = await Keyword.findOne({ profileId: demoData.profileId });
      if (existing) {
        return res.status(409).json({ message: "A keyword document for this profile already exists." });
      }
  
      const newKeywords = new Keyword(demoData);
      await newKeywords.save();
  
      res.status(201).json({
        message: "Demo keywords added successfully!",
        data: newKeywords,
      });
  
    } catch (err) {
      console.error("Error adding demo keywords:", err.message);
      res.status(500).json({ message: "Server error." });
    }
  };