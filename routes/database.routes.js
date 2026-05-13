const { Router } = require("express");
const mysqlMethods = require("../database/mysql.methods");

const router = Router();

router.get("/api/db/health", async (req, res) => {
  try {
    const result = await mysqlMethods.testConnection();
    res.json({
      message: "MySQL connection OK",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "MySQL connection error",
      error: error.message,
    });
  }
});

module.exports = router;
