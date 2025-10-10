import Profile from "../models/Profile.js";
import User from "../models/User.js";


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
