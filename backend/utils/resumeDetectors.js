function detectContact(text) {
  const email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const phone = /(\+?\d{1,3}[\s-]?)?(\(?\d{3,5}\)?[\s-]?)?\d{3,5}[\s-]?\d{4,5}/.test(
    text.replace(/\d{4}\s*[-–]\s*\d{4}/g, "")
  );
  const linkedin = /linkedin\.com|linkedin/i.test(text);
  const github = /github\.com|github/i.test(text);
  const portfolio = /portfolio|https?:\/\/(?!.*(linkedin|github))/i.test(text);
  return { email, phone, linkedin, github, portfolio };
}

function detectExperience(text) {
  const m = text.match(/(\d{1,2})\+?\s*(?:years?|yrs?)\b[^.\n]{0,25}experience/i) ||
    text.match(/experience[^.\n]{0,25}?(\d{1,2})\+?\s*(?:years?|yrs?)/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

module.exports = { detectContact, detectExperience };
