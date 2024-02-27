const express = require("express");
const router = express.Router();

const txController = require("./../controllers/txController");

router.get("/latest", txController.latestTx);
router.get("/:txhash", txController.getTxByHash);
router.get("/all",txController.getAllTxs)

module.exports = router;
