import User from "../models/User.js";



// Get single profile by ID (only if it belongs to logged-in user)

export const getUserById = async (req, res) => {
    try {
      const profile = await User.findOne({
        _id: req.params.userId
      });
  
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(profile);
    } catch (err) {
      console.error("Error fetching User by ID:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  };