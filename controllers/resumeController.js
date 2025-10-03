import axios from "axios";
import fs from "fs";

export const parseResume = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file?"file uploaded":"file not uploaded")

    const fileData = fs.readFileSync(req.file.path);

    const response = await axios.post(
      "https://api.affinda.com/v3/resumes",
      fileData,
      {
        headers: {
          "Authorization": `Bearer ${process.env.AFFINDA_API_KEY}`,
          "Content-Type": "application/octet-stream"
        }
      }
    );

    // delete uploaded file after parsing
    fs.unlinkSync(req.file.path);

    return res.json(response.data);
  } catch (err) {
    console.error("Affinda error:", err.message);
    return res.status(500).json({ message: "Error parsing resume" });
  }
};
