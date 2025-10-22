// services/keywordBuilder.js
import Keyword from "../models/Keyword.js";
import Profile from "../models/Profile.js";

const STOP = new Set([
  "a","an","the","of","and","or","for","to","in","on","with","by","from","at","as","is","are","was","were",
  "be","been","being","this","that","these","those","into","about","over","under","per","our","your","their",
  "his","her","its","not","including","plus","via","using","use"
]);

const norm = s => String(s||"").toLowerCase().replace(/[^\w@.+#/\- ]+/g," ").replace(/\s+/g," ").trim();
const uniq = arr => Array.from(new Set(arr.filter(Boolean)));
const tokenize = s => norm(s).split(" ").filter(t => t && !STOP.has(t) && t.length>1);

export async function buildKeywords(profileId) {
  const p = await Profile.findById(profileId).lean();
  if (!p) throw new Error("Profile not found");

  const raw = [];
  const push = v => { if (!v) return; Array.isArray(v) ? v.forEach(push) : raw.push(v); };

  // collect
  push([p.profileName, p.firstName, p.lastName, p.pronouns, p.email, p.city, p.state, p.country, p.nationality, p.citizenshipStatus]);
  push(p.skills);
  push(p.achievements);
  (p.languages||[]).forEach(l => push([l.language, l.proficiency]));
  (p.experience||[]).forEach(e => push([e.company, e.role, e.experienceType, e.description]));
  (p.education||[]).forEach(e => push([e.school, e.degree, e.fieldOfStudy, e.grade]));
  (p.projects||[]).forEach(pr => push([pr.title, pr.description, ...(pr.technologies||[])]));
  (p.certifications||[]).forEach(c => push([c.name, c.issuer]));
  push(p.preferredLocations);

  const bag = uniq(tokenize(raw.join(" ")));

  const skills = uniq((p.skills||[]).map(norm));
  const tools = bag.filter(t => /(git|github|gitlab|bitbucket|jira|figma|terraform|jenkins|kafka|airflow|snowflake|tableau|docker|kubernetes|aws|gcp|azure|sql|postgresql|mysql|mongodb)/.test(t));
  const education = bag.filter(t => /(bachelor|master|degree|computer|science|engineering|cs|b\.tech|m\.tech|ms|bs)/.test(t));
  const experience = bag.filter(t => /(engineer|developer|manager|lead|architect|intern|sre|devops|frontend|backend|full\s?stack|data|ml|ai)/.test(t));
  const certifications = uniq((p.certifications||[]).map(c=>norm(c.name)));
  const languages = uniq((p.languages||[]).map(l=>norm(l.language)));
  const locations = uniq([p.city,p.state,p.country].map(norm).filter(Boolean));
  const covered = new Set([...skills,...tools,...education,...experience,...certifications,...languages,...locations]);
  const extras = uniq(bag.filter(t=>!covered.has(t)));
  const all = uniq([...skills,...tools,...education,...experience,...certifications,...languages,...locations,...extras]);

  const doc = await Keyword.findOneAndUpdate(
    { profileId: p._id },
    {
      userId: p.userId,
      profileId: p._id,
      keywords: { skills, tools, education, experience, certifications, languages, locations, extras, all },
      sourceHashes: { profileUpdatedAt: p.updatedAt },
    },
    { new:true, upsert:true }
  );
  return doc.toObject();
}