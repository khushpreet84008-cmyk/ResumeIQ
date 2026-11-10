const { SKILLS } = require("../data/skills");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build one regex per skill. Boundaries are "not a letter/digit" so c++, c#, node.js work.
const SKILL_INDEX = [];
for (const [category, list] of Object.entries(SKILLS)) {
  for (const [name, aliases] of list) {
    const pattern = aliases.map(escapeRegex).join("|");
    SKILL_INDEX.push({
      name,
      category,
      regex: new RegExp(`(?<![a-z0-9+#])(?:${pattern})(?![a-z0-9]|\\+\\+|#)`, "i"),
    });
  }
}

function extractSkills(text) {
  const found = [];
  for (const s of SKILL_INDEX) {
    if (s.regex.test(text)) found.push({ name: s.name, category: s.category });
  }
  return found;
}

module.exports = { extractSkills };
