import Keyword from "../models/Keyword.js";
import { scoreJD } from "../utils/score.js";

// POST /api/score/jd-match
export const jdMatch = async (req, res) => {
  try {
    const { jdText, userId, profileId } = req.body || {};
    if (!jdText || !userId) return res.status(400).json({ ok:false, message:"jdText and userId required" });

    // If profileId present: score just that profile; else score all of user's profiles
    const docs = await Keyword.find(profileId ? { userId, profileId } : { userId });
    const results = docs.map(d => {
      const s = scoreJD(jdText, d.keywords);
      return {
        profileId: String(d.profileId),
        userId: String(d.userId),
        score: s.score,
        matchedKeywords: s.matchedKeywords,
        totalProfileKeywords: s.totalProfileKeywords,
        jdTokenCount: s.jdTokenCount
      };
    }).sort((a,b)=>b.score-a.score);

    res.json({ ok:true, results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, message:"Scoring failed" });
  }
};