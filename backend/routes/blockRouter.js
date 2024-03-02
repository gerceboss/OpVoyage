const express = require("express");
const router = express.Router();

const blockController = require("./../controllers/blockController");
const txController = require("./../controllers/txController");

router.get("/latest", blockController.latestBlock);
router.get("/all", blockController.getAllBlocks);
router.get("/latestFive", blockController.getLatestFive);
router.get("/:num", blockController.latestBlockByNumber);
router.get("/:num/txs", txController.getTxByBlockNumber);

module.exports = router;
