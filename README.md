# ResumeIQ — Modular AI Resume Analyzer

This is the reorganized version of the supplied project. The existing design and resume-analysis logic are retained while frontend and backend code are separated into modules.

## Requirements
- Node.js 18 or newer
- npm

## Run on Windows (easiest)
1. Extract the ZIP completely.
2. Open the `ResumeIQ_Modular` folder.
3. Double-click `run.bat`.
4. Wait for the first-time package installation to finish.
5. Open http://localhost:3000 if the browser does not open automatically. Keep the terminal window open.
6. To stop the server, press `Ctrl + C` in the terminal.

## Run manually (Windows / macOS / Linux)
1. Open a terminal inside the extracted `ResumeIQ_Modular` folder.
2. Run `npm install`.
3. Run `npm start`.
4. Visit http://localhost:3000.
5. Stop the server with `Ctrl + C`.

**Main entry file:** `server.js`, started by `npm start`. Do not open `frontend/index.html` directly because resume analysis requires the backend API.

## Project structure
```text
ResumeIQ_Modular/
├── server.js
├── package.json
├── run.bat
├── README.md
├── backend/
│   ├── app.js
│   ├── config/ (analysisConfig.js, upload.js)
│   ├── data/ (roles.js, skills.js)
│   ├── middleware/ (errorHandler.js)
│   ├── routes/ (analyzeRoute.js)
│   ├── services/ (fileTextExtractor.js, jobLinks.js, resumeAnalyzer.js)
│   └── utils/ (resumeDetectors.js, skillExtractor.js)
└── frontend/
    ├── index.html
    ├── css/ (base.css, forms.css, results.css, responsive.css, theme.css)
    └── js/ (actions.js, dom.js, helpers.js, results.js, upload.js)
```

## Features retained
- PDF, DOCX and TXT resume upload (5 MB maximum)
- Resume score out of 100 and score breakdown
- Skill detection and grouped skills
- Strengths and improvement suggestions
- Job-role matching with match percentages and job-site links
- Preferred job location and experience-level selection
- Uploaded files are processed in memory, not saved to disk

## Technology note
The supplied frontend uses HTML, CSS and Vanilla JavaScript, not React. This refactor preserves that working stack rather than converting the project and risking behavior changes. The analysis engine is rule-based and runs locally; it does not use a paid AI API.

git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/khushpreet84008-cmyk/ResumeIQ.git
git push -u origin main
