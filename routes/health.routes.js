const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("API is running on localhost x");
});

router.get("/api/health", (req, res) => {
  res.send("OK");
});

module.exports = router;
