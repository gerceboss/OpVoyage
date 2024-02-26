const express = require("express");
const router = express.Router();

const controller = require("../controllers/controller");
const contractController = require("../controllers/contractTag");

router.get("/latest", controller.latestBlock);
router.get("/latest/:num", controller.latestBlockByNumber);

router.get("/code", contractController.displayCode);

module.exports = router;
