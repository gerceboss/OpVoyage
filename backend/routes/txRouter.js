const express = require("express");
const router = express.Router();

const txController = require("./../controllers/txController");

// router.get("/latest", txController.latestTx);
router.get("/all", txController.getAllTxs);
router.get("/:txhash", txController.getTxByHash);
router.get("/block/:txhash", txController.getBlockByTxHash);
router.get("/:address/txs",txController.getTxByAddress);

module.exports = router;
