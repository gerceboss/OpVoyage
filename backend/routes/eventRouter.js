const express = require("express");
const router = express.Router();

const eventController = require("./../controllers/eventController");

router.get("/block/latest", eventController.latestBlockEvent);

module.exports = router;
