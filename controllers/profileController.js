import Profile from "../models/Profile.js";
import User from "../models/User.js";
import DemoProfile from "../models/Test.js";



export const createProfile = async (req, res) => {
  try {
    // ✨ UPDATED: Destructure all fields directly from req.body
    const {
      profileName, resumeUrl, subscription,
      firstName, lastName, pronouns,
      gender, ethnicity, race, disabilityStatus, veteranStatus,
      email, phoneCountryCode, phone, street, city, state, country, zipCode,
      portfolio, linkedin, github, twitter, otherSocialLink,
      nationality, usAuthorized, sponsorshipRequired, citizenshipStatus,
      jobType, preferredLocations, currentCTC, expectedCTC, willingToRelocate,
      noticePeriodAvailable, noticePeriodDurationInDays,
      totalExperienceInYears, skills, achievements,
      experience, education, projects, certifications, languages, publications
    } = req.body;

    if (!profileName || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "Profile name, full name, and email are required." });
    }

    const profile = new Profile({
      userId: req.user._id, // Assumes req.user is populated by auth middleware
      
      // ✨ UPDATED: Pass all flattened fields directly
      profileName, resumeUrl, subscription,
      firstName, lastName, pronouns,
      gender, ethnicity, race, disabilityStatus, veteranStatus,
      email, phoneCountryCode, phone, street, city, state, country, zipCode,
      portfolio, linkedin, github, twitter, otherSocialLink,
      nationality, usAuthorized, sponsorshipRequired, citizenshipStatus,
      jobType, preferredLocations, currentCTC, expectedCTC, willingToRelocate,
      noticePeriodAvailable, noticePeriodDurationInDays,
      totalExperienceInYears, skills, achievements,
      experience, education, projects, certifications, languages, publications
    });

    const savedProfile = await profile.save();

    // Add profileId reference to user (this logic remains the same)
    await User.findByIdAndUpdate(req.user._id, {
      $push: { profileIds: savedProfile._id },
    });

    res.status(201).json({
      message: "Profile created successfully!",
      profile: savedProfile,
    });

  } catch (err) {
    console.error("Error creating profile:", err.message);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: "Validation failed.", errors });
    }
    res.status(500).json({ message: "Server error while creating profile." });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params; 
    const userId = req.user._id;

    const deletedProfile = await Profile.findOneAndDelete({
      _id: profileId,
      userId: userId, 
    });

 
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found or you are not authorized to delete it." });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { profileIds: deletedProfile._id },
    });

    // 4. Send a success response.
    res.status(200).json({ message: "Profile deleted successfully." });

  } catch (err) {
    console.error("Error deleting profile:", err.message);
    res.status(500).json({ message: "Server error while deleting profile." });
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
