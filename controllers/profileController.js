import Profile from "../models/Profile.js";
import User from "../models/User.js";
import DemoProfile from "../models/Test.js";



export const createProfile = async (req, res) => {
  try {
    const { profileName, details, resumeUrl } = req.body;

    // Basic check for top-level required fields
    if (!profileName || !details) {
      return res.status(400).json({ message: "Profile name and details are required" });
    }

    const profile = new Profile({
      userId: req.user._id, // Assumes req.user is populated by auth middleware
      profileName,
      details,
      resumeUrl,
    });

    const savedProfile = await profile.save();

    // Add the new profile's ID to the corresponding user document
    await User.findByIdAndUpdate(req.user._id, {
      $push: { profileIds: savedProfile._id },
    });

    res.status(201).json({ // Use 201 for resource creation
      message: "Profile created successfully!",
      profile: savedProfile,
    });

  } catch (err) {
    console.error("Error creating profile:", err.message);

    // ✨ Enhanced Error Handling for Mongoose Validation
    if (err.name === 'ValidationError') {
      // Extract validation messages
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ 
        message: "Validation failed. Please check your input.",
        errors: errors 
      });
    }

    // Generic server error for other issues
    res.status(500).json({ message: "Server error while creating profile." });
  }
};

export const createDemoProfile = async (req, res) => {
  try {
    // Hardcoded demo data that matches your flattened schema
    const demoProfileData = {
      userId: req.user._id,
      profileName: `Demo Profile - ${Date.now()}`,
      resumeUrl: "https://example.com/resume.pdf",
      subscription: "Premium",

      // Personal Info
      firstName: "Alex",
      lastName: "Doe",
      pronouns: "they/them",

      // Demographics
      gender: "Non-binary",
      ethnicity: "Not Hispanic or Latino",
      race: "Two or More Races",
      disabilityStatus: "No",
      veteranStatus: "No",
      
      // Contact Info
      email: "alex.doe@example.com",
      phoneCountryCode: "+1",
      phone: "5551234567",
      street: "123 Innovation Drive",
      city: "Techville",
      state: "California",
      country: "USA",
      zipCode: "94043",
      portfolio: "https://alexdoe.dev",
      linkedin: "https://linkedin.com/in/alexdoe",
      github: "https://github.com/alexdoe",
      twitter: "https://twitter.com/alexdoe",
      otherSocialLink: "https://medium.com/@alexdoe",

      // Work Authorization
      nationality: "American",
      usAuthorized: true,
      sponsorshipRequired: false,
      citizenshipStatus: "U.S. Citizen",
      
      // Job Preferences
      jobType: "Remote",
      preferredLocations: ["San Francisco, CA", "New York, NY", "Remote"],
      currentCTC: "150,000 USD",
      expectedCTC: "175,000 USD",
      willingToRelocate: true,
      noticePeriodAvailable: false,
      noticePeriodDurationInDays: 0,

      // Career Summary
      totalExperienceInYears: 5,
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes"],
      achievements: ["Won the 2024 TechCrunch Disrupt hackathon", "Published a popular open-source library"],
      
      // Arrays of Sub-documents
      experience: [
        {
          company: "Innovate Inc.",
          role: "Senior Software Engineer",
          experienceType: "Job",
          startDate: new Date("2021-06-01"),
          isCurrent: true,
          description: "Led the development of a scalable microservices architecture."
        }
      ],
      education: [
        {
          school: "Tech University",
          degree: "Master of Science",
          fieldOfStudy: "Computer Science",
          grade: "3.9 GPA"
        }
      ],
      projects: [
        {
          title: "AI-Powered Task Manager",
          description: "A smart task manager that automatically prioritizes tasks.",
          technologies: ["React", "Python", "FastAPI"],
          githubLink: "https://github.com/alexdoe/ai-task-manager"
        }
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          issueDate: new Date("2022-08-15")
        }
      ],
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Conversational" }
      ],
      publications: [
        {
          title: "A Novel Approach to State Management in React",
          link: "https://tech-journal.com/article123",
          description: "Published in the International Journal of Web Development."
        }
      ]
    };

    const newDemoProfile = new DemoProfile(demoProfileData);
    const savedProfile = await newDemoProfile.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { profileIds: savedProfile._id },
    });

    res.status(201).json({
      message: "Demo profile created successfully!",
      profile: savedProfile,
    });

  } catch (err) {
    console.error("Error creating demo profile:", err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: "Validation failed.", errors });
    }
    res.status(500).json({ message: "Server error while creating demo profile." });
  }
};

export const getDemoProfiles = async (req, res) => {
  try {
    const profiles = await DemoProfile.find({ userId: req.params.userId});
    res.status(200).json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all profiles of logged-in user
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.params.userId});
    res.status(200).json(profiles);
  } catch (err) {
    console.error("Error fetching profiles:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single profile by ID (only if it belongs to logged-in user)
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.profileId
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile by ID:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
