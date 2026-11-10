function jobLinks(role, location, isFresher) {
  const q = encodeURIComponent(role.query + (isFresher ? " fresher" : ""));
  const loc = encodeURIComponent(location);
  const locSlug = location.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const links = [
    {
      site: "LinkedIn",
      url: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=${loc}`,
    },
    {
      site: "Naukri",
      url: `https://www.naukri.com/${role.slug}${isFresher ? "-fresher" : ""}-jobs${
        locSlug && locSlug !== "india" ? "-in-" + locSlug : ""
      }`,
    },
    {
      site: "Indeed",
      url: `https://in.indeed.com/jobs?q=${q}&l=${loc}`,
    },
    {
      site: "Internshala",
      url: isFresher
        ? `https://internshala.com/internships/keywords-${encodeURIComponent(role.query.toLowerCase().replace(/\s+/g, "-"))}`
        : `https://internshala.com/jobs/${role.slug}-jobs`,
    },
    {
      site: "Glassdoor",
      url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${q}`,
    },
  ];
  return links;
}

module.exports = { jobLinks };
