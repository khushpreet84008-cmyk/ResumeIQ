function renderResults(r) {
  const results = $("results");
  results.hidden = false;

  $("resultMeta").textContent = `${r.level} · Jobs for: ${r.location}`;

  // Score ring (circumference of r=70 is ~440)
  $("scoreNum").textContent = "0";
  const ring = $("ringFg");
  ring.style.strokeDashoffset = 440;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ring.style.strokeDashoffset = 440 - (440 * r.score) / 100;
  }));
  animateNumber($("scoreNum"), r.score);

  const gradeEl = $("gradeBadge");
  gradeEl.textContent = r.grade;
  gradeEl.className = "grade " + ({ Excellent: "g-excellent", Good: "g-good", Fair: "g-fair" }[r.grade] || "g-low");

  $("statWords").textContent = r.stats.wordCount;
  $("statSkills").textContent = r.stats.technicalSkills;
  $("statVerbs").textContent = r.stats.actionVerbs;

  // Breakdown bars
  $("breakdown").innerHTML = r.breakdown.map((b) => `
    <div>
      <div class="bar-top"><span>${esc(b.label)}</span><span>${b.score} / ${b.max}</span></div>
      <div class="bar"><i data-w="${(b.score / b.max) * 100}" class="${b.score / b.max < 0.5 ? "low" : b.score / b.max < 0.8 ? "mid" : ""}"></i></div>
    </div>`).join("");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll("#breakdown .bar > i").forEach((i) => (i.style.width = i.dataset.w + "%"));
  }));

  // Jobs
  const jobsEl = $("jobs");
  if (!r.jobs.length) {
    jobsEl.innerHTML = `<div class="card" style="grid-column:1/-1"><b>No strong matches yet.</b>
      <p class="muted">We could not find enough technical skills in your resume. Add a clear Skills section listing your languages, frameworks and tools, then analyze again.</p></div>`;
  } else {
    jobsEl.innerHTML = r.jobs.map((j, idx) => `
      <article class="job ${idx === 0 ? "top" : ""}">
        ${idx === 0 ? '<span class="badge-top">BEST MATCH</span>' : ""}
        <div class="job-head">
          <h4>${esc(j.title)}</h4>
          <div class="match ${j.match >= 70 ? "" : j.match >= 50 ? "mid" : "low"}">${j.match}%</div>
        </div>
        <p class="desc">${esc(j.summary)}</p>
        ${j.matchedSkills.length ? `<div class="label">Your matching skills</div>
          <div class="chips">${j.matchedSkills.map((s) => `<span class="chip ok">${esc(s)}</span>`).join("")}</div>` : ""}
        ${j.missingSkills.length ? `<div class="label">Good to add</div>
          <div class="chips">${j.missingSkills.map((s) => `<span class="chip miss">${esc(s)}</span>`).join("")}</div>` : ""}
        <div class="apply">
          <div class="apply-label">Apply on</div>
          <div class="apply-links">
            ${j.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.site)} &#8599;</a>`).join("")}
          </div>
        </div>
      </article>`).join("");
  }

  // Skills
  const skillsEl = $("skills");
  const cats = Object.entries(r.skills);
  skillsEl.innerHTML = cats.length
    ? cats.map(([cat, list]) => `
        <div class="skill-group"><h5>${esc(cat)}</h5>
          <div class="chips">${list.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div></div>`).join("")
    : '<p class="muted">No recognised skills found. Add a Skills section to your resume.</p>';

  $("gaps").innerHTML = r.skillGaps.length
    ? r.skillGaps.map((s) => `<span class="chip miss">${esc(s)}</span>`).join("")
    : '<span class="muted small">Great, no major gaps for your top matches.</span>';

  $("strengths").innerHTML = r.strengths.length
    ? r.strengths.map((s) => `<li>${esc(s)}</li>`).join("")
    : '<li>Keep going, the tips below will help you improve quickly.</li>';

  $("suggestions").innerHTML = r.suggestions.length
    ? r.suggestions.map((s) => `<li><span class="tag ${s.type}">${s.type}</span><span>${esc(s.text)}</span></li>`).join("")
    : '<li><span class="tag tip">great</span><span>Your resume looks solid. Nothing major to fix.</span></li>';

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

