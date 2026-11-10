function errorHandler(err, req, res, next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File is too large. Maximum size is 5 MB." });
  }
  console.error(err);
  return res.status(500).json({ error: "Something went wrong. Please try again." });
}
module.exports = { errorHandler };
