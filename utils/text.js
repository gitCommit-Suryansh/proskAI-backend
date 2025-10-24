export function tokenize(text = "") {
    return String(text)
      .toLowerCase()
      .replace(/[\u2018\u2019]/g,"'")
      .replace(/[^a-z0-9#+.\-_/ ]+/g," ")
      .split(/\s+/)
      .map(t => t.trim())
      .filter(Boolean);
  }
  
  export function dedupe(arr=[]) {
    return Array.from(new Set(arr));
  }