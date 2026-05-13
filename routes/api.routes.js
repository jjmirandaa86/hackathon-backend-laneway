const { Router } = require("express");
const airQualityRoutes = require("./airQuality.routes");
const databaseRoutes = require("./database.routes");
const healthRoutes = require("./health.routes");

const router = Router();

router.use(healthRoutes);
router.use(databaseRoutes);
router.use(airQualityRoutes);

module.exports = router;
