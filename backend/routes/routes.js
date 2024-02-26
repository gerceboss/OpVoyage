const express = require("express");
const router = express.Router();

const controller = require("../controllers/controller");

router.get("/latest", controller.latestBlock);
router.get("/latest/:num", controller.latestBlockByNumber);

module.exports = router;
