import { tokenize, dedupe } from "./text.js";

export function scoreJD(jdText, profileKeywords=[]) {
  const jdTokens = dedupe(tokenize(jdText));
  const jdSet = new Set(jdTokens);
  const normProfile = (Array.isArray(profileKeywords) ? profileKeywords : [])
    .map(s => String(s).toLowerCase().trim())
    .filter(Boolean);

  const matches = normProfile.filter(k => jdSet.has(k));
  const score = normProfile.length ? Math.round((matches.length / normProfile.length) * 100) : 0;

  return { score, matchedKeywords: matches, totalProfileKeywords: normProfile.length, jdTokenCount: jdTokens.length };
}