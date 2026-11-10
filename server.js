const app = require("./backend/app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ResumeIQ AI Resume Analyzer running at http://localhost:${PORT}`);
});
