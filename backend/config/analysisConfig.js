const SECTION_PATTERNS = {
  "Summary / Objective": /\b(summary|objective|profile|about me|career objective)\b/i,
  Education: /\b(education|academic|qualification|b\.?tech|bachelor|master|degree|university|college)\b/i,
  Experience: /\b(experience|employment|work history|internship|intern\b|professional background)/i,
  Skills: /\b(skills|technical skills|technologies|tech stack|core competencies)\b/i,
  Projects: /\b(projects?|academic projects|personal projects)\b/i,
  "Certifications / Achievements": /\b(certifications?|certificates?|achievements?|awards?|courses?|training)\b/i,
};

const ACTION_VERBS = [
  "developed", "built", "designed", "implemented", "created", "led", "managed", "optimized",
  "optimised", "improved", "reduced", "increased", "launched", "deployed", "automated",
  "integrated", "engineered", "architected", "analyzed", "analysed", "delivered", "collaborated",
  "established", "streamlined", "migrated", "tested", "maintained", "mentored", "achieved",
];

module.exports = { SECTION_PATTERNS, ACTION_VERBS };
