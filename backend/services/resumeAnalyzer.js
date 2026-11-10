const { extractSkills } = require("../utils/skillExtractor");
const { ROLES } = require("../data/roles");
const { jobLinks } = require("./jobLinks");
const { SECTION_PATTERNS, ACTION_VERBS } = require("../config/analysisConfig");
const { detectContact, detectExperience } = require("../utils/resumeDetectors");

function analyzeResume(rawText, options = {}) {
  const text = rawText.replace(/\r/g, "").replace(/[ \t]+/g, " ");
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const skills = extractSkills(text);
  const techSkills = skills.filter((s) => s.category !== "Soft Skills");
  const contact = detectContact(text);
  const years = detectExperience(text);

  // --- Sections ---
  const sectionsFound = {};
  for (const [name, re] of Object.entries(SECTION_PATTERNS)) {
    // A section counts only if a heading-like short line matches
    sectionsFound[name] = lines.some((l) => l.length < 45 && re.test(l));
  }
  // fallback: loose match on whole text for education / skills
  if (!sectionsFound.Education && SECTION_PATTERNS.Education.test(text)) sectionsFound.Education = true;
  if (!sectionsFound.Skills && techSkills.length >= 4) sectionsFound.Skills = true;

  // --- Impact: action verbs and numbers ---
  const verbHits = ACTION_VERBS.filter((v) => new RegExp(`\\b${v}\\b`, "i").test(lower));
  const numberHits = (text.match(/\b\d+(\.\d+)?\s?(%|\+|x|k|lpa|users|customers|projects|clients|ms|seconds|hours)/gi) || []).length;
  const bulletLines = lines.filter((l) => /^[•\-–*▪●◦]/.test(l)).length;

  // --- Experience level ---
  let level = options.experienceLevel;
  if (!level || level === "auto") {
    if (years !== null) level = years >= 3 ? "experienced" : "fresher";
    else level = "fresher";
  }
  const isFresher = level !== "experienced";

  // ---------------- Scoring (total 100) ----------------
  const breakdown = [];

  // Contact (15)
  let contactScore = 0;
  if (contact.email) contactScore += 5;
  if (contact.phone) contactScore += 4;
  if (contact.linkedin) contactScore += 3;
  if (contact.github || contact.portfolio) contactScore += 3;
  breakdown.push({ label: "Contact & Links", score: contactScore, max: 15 });

  // Sections (20)
  const secNames = Object.keys(sectionsFound);
  const secCount = secNames.filter((n) => sectionsFound[n]).length;
  const secScore = Math.round((secCount / secNames.length) * 20);
  breakdown.push({ label: "Resume Sections", score: secScore, max: 20 });

  // Skills (25) - 12+ technical skills is excellent
  const skillScore = Math.min(25, Math.round((techSkills.length / 12) * 25));
  breakdown.push({ label: "Skills & Keywords", score: skillScore, max: 25 });

  // Impact (25)
  const verbScore = Math.min(10, Math.round((verbHits.length / 8) * 10));
  const numScore = Math.min(10, Math.round((numberHits / 4) * 10));
  const bulletScore = Math.min(5, Math.round((bulletLines / 8) * 5));
  breakdown.push({ label: "Impact & Achievements", score: verbScore + numScore + bulletScore, max: 25 });

  // Length & readability (15)
  let lengthScore = 0;
  if (wordCount >= 250 && wordCount <= 900) lengthScore = 15;
  else if (wordCount >= 150 && wordCount < 250) lengthScore = 9;
  else if (wordCount > 900 && wordCount <= 1300) lengthScore = 10;
  else lengthScore = 4;
  breakdown.push({ label: "Length & Readability", score: lengthScore, max: 15 });

  const score = breakdown.reduce((a, b) => a + b.score, 0);

  let grade = "Needs Work";
  if (score >= 85) grade = "Excellent";
  else if (score >= 70) grade = "Good";
  else if (score >= 50) grade = "Fair";

  // ---------------- Suggestions ----------------
  const suggestions = [];
  const strengths = [];

  if (!contact.email) suggestions.push({ type: "critical", text: "Add a professional email address at the top of your resume." });
  else strengths.push("Email address is present.");
  if (!contact.phone) suggestions.push({ type: "critical", text: "Add your phone number so recruiters can reach you quickly." });
  if (!contact.linkedin) suggestions.push({ type: "tip", text: "Add your LinkedIn profile link. Most recruiters check it." });
  if (!contact.github && !contact.portfolio) suggestions.push({ type: "tip", text: "Add your GitHub or portfolio link to showcase your projects." });
  else strengths.push("GitHub / portfolio link found.");

  for (const name of secNames) {
    if (!sectionsFound[name]) {
      const critical = ["Education", "Skills", "Experience", "Projects"].includes(name);
      if (name === "Experience" && isFresher) {
        suggestions.push({ type: "tip", text: "Add an Internships / Experience section, even training or freelance work counts." });
      } else {
        suggestions.push({
          type: critical ? "important" : "tip",
          text: `Add a clear "${name}" section with a proper heading.`,
        });
      }
    }
  }
  if (secCount >= 5) strengths.push("Resume has a well-organised set of sections.");

  if (techSkills.length < 8) suggestions.push({ type: "important", text: `Only ${techSkills.length} technical skills were detected. List more relevant tools, languages and frameworks you know.` });
  else strengths.push(`${techSkills.length} technical skills detected, a solid skill set.`);

  if (verbHits.length < 5) suggestions.push({ type: "important", text: "Start bullet points with strong action verbs such as Developed, Built, Designed, Optimised, Deployed." });
  else strengths.push("Good use of action verbs.");

  if (numberHits < 2) suggestions.push({ type: "important", text: "Quantify your impact with numbers, e.g. \"improved load time by 40%\" or \"built an app used by 200+ users\"." });
  else strengths.push("Achievements include measurable numbers.");

  if (bulletLines < 4) suggestions.push({ type: "tip", text: "Use bullet points for projects and experience so the resume is easy to scan." });

  if (wordCount < 250) suggestions.push({ type: "important", text: `Your resume is short (${wordCount} words). Add project details, responsibilities and technologies used.` });
  else if (wordCount > 900) suggestions.push({ type: "tip", text: `Your resume is long (${wordCount} words). Try to keep it to 1 page (fresher) or 2 pages (experienced).` });
  else strengths.push("Resume length is in the ideal range.");

  const order = { critical: 0, important: 1, tip: 2 };
  suggestions.sort((a, b) => order[a.type] - order[b.type]);

  // ---------------- Job matching ----------------
  const have = new Set(skills.map((s) => s.name));
  const location = options.location || "India";

  const matches = ROLES.map((role) => {
    const coreHave = role.core.filter((s) => have.has(s));
    const bonusHave = role.bonus.filter((s) => have.has(s));
    const minCore = role.minCoreHits || Math.min(2, role.core.length);

    const coreRatio = role.minCoreHits
      ? Math.min(1, coreHave.length / role.minCoreHits)
      : coreHave.length / role.core.length;
    const bonusRatio = role.bonus.length ? bonusHave.length / role.bonus.length : 0;

    let match = Math.round((coreRatio * 0.7 + Math.min(1, bonusRatio * 1.5) * 0.3) * 100);
    if (coreHave.length < minCore) match = Math.min(match, 35);

    const missing = [...role.core, ...role.bonus].filter((s) => !have.has(s)).slice(0, 5);
    return {
      title: role.title,
      summary: role.summary,
      match,
      matchedSkills: [...coreHave, ...bonusHave],
      missingSkills: missing,
      links: jobLinks(role, location, isFresher),
    };
  })
    .filter((m) => m.match >= 35)
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);

  // Group detected skills by category for the UI
  const grouped = {};
  for (const s of skills) {
    (grouped[s.category] = grouped[s.category] || []).push(s.name);
  }

  // Skills worth learning next = most common missing skills among top matches
  const gapCount = {};
  matches.slice(0, 3).forEach((m) => m.missingSkills.forEach((s) => (gapCount[s] = (gapCount[s] || 0) + 1)));
  const skillGaps = Object.entries(gapCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([s]) => s);

  return {
    score,
    grade,
    breakdown,
    stats: { wordCount, technicalSkills: techSkills.length, actionVerbs: verbHits.length, sectionsFound: secCount },
    level: isFresher ? "Fresher / Entry level" : "Experienced",
    location,
    sections: sectionsFound,
    contact,
    skills: grouped,
    strengths,
    suggestions,
    jobs: matches,
    skillGaps,
  };
}


module.exports = { analyzeResume };
