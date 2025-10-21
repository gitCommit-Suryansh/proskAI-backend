import cloudinary from '../config/cloudinary.js'; // ✅ FIXED: Correct path to your config
import streamifier from 'streamifier';

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