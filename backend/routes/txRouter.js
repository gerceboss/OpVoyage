const express = require("express");
const router = express.Router();

const txController = require("./../controllers/txController");

// router.get("/latest", txController.latestTx);
router.get("/all", txController.getAllTxs);
router.get("/:txhash", txController.getTxByHash);

module.exports = router;
