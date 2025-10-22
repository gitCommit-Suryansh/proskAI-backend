// routes/keywordRoutes.js
import express from "express";
import Keyword from "../models/Keyword.js";
import Profile from "../models/Profile.js";
import { buildKeywords } from "../services/keywordBuilder.js";

const router = express.Router();

// fetch cached or rebuild if stale/missing
router.get("/:profileId", async (req,res)=>{
  try{
    const pid = req.params.profileId;
    let doc = await Keyword.findOne({ profileId: pid }).lean();
    const prof = await Profile.findById(pid).select("updatedAt").lean();
    const stale = !doc?.sourceHashes?.profileUpdatedAt || (prof?.updatedAt && new Date(prof.updatedAt) > new Date(doc.sourceHashes.profileUpdatedAt));
    if (!doc || stale) doc = await buildKeywords(pid);
    res.json({ ok:true, rebuilt: !doc || stale, keywords: doc.keywords });
  }catch(e){
    res.status(400).json({ ok:false, error: e.message });
  }
});

// force rebuild
router.get("/rebuild/:profileId", async (req,res)=>{
  try{
    const out = await buildKeywords(req.params.profileId);
    res.json({ ok:true, rebuilt:true, keywords: out.keywords });
  }catch(e){
    res.status(400).json({ ok:false, error: e.message });
  }
});

export default router;