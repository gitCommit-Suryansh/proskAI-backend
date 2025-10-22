// routes/matchRoutes.js
import express from "express";
import Keyword from "../models/Keyword.js";

const router = express.Router();

function overlapScore(jdKw, profKw){
  const catW = { skills:0.5, tools:0.15, education:0.1, experience:0.25 };
  const toSet = arr => new Set((arr||[]).map(s=>String(s).toLowerCase()));
  let got=0, total=0;

  for (const c of Object.keys(catW)){
    const want = toSet(jdKw[c]);
    if (!want.size) continue;
    const have = toSet(profKw[c]);
    const inter = [...want].filter(k=>have.has(k)).length;
    got += (inter / want.size) * catW[c];
    total += catW[c];
  }
  const anyWant = toSet(jdKw.keywords);
  const anyHave = toSet(profKw.all);
  const anyInter = [...anyWant].filter(k=>anyHave.has(k)).length;
  const anyScore = anyWant.size ? (anyInter/anyWant.size) : 0;

  const score = Math.round(100 * (0.8*(got/Math.max(total,1)) + 0.2*anyScore));
  const missing = {
    skills:      (jdKw.skills||[]).filter(s=>!toSet(profKw.skills).has(String(s).toLowerCase())),
    tools:       (jdKw.tools||[]).filter(s=>!toSet(profKw.tools).has(String(s).toLowerCase())),
    education:   (jdKw.education||[]).filter(s=>!toSet(profKw.education).has(String(s).toLowerCase())),
    experience:  (jdKw.experience||[]).filter(s=>!toSet(profKw.experience).has(String(s).toLowerCase())),
  };
  return { score: Math.max(0, Math.min(100, score)), missing };
}

// POST /api/match/score { profileId, jdKeywords }
router.post("/score", async (req,res)=>{
  try{
    const { profileId, jdKeywords } = req.body || {};
    if (!profileId || !jdKeywords) throw new Error("profileId and jdKeywords required");
    const kw = await Keyword.findOne({ profileId }).lean();
    if (!kw) throw new Error("Profile keywords not found (build them first)");
    const result = overlapScore(jdKeywords, kw.keywords || {});
    res.json({ ok:true, ...result });
  }catch(e){
    res.status(400).json({ ok:false, error: e.message });
  }
});

export default router;