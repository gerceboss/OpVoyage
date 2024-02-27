const express = require("express");
const router = express.Router();

const blockController = require("./../controllers/blockController");

router.get("/latest", blockController.latestBlock);
router.get("/:num", blockController.latestBlockByNumber);
router.get("/all", blockController.getAllBlocks);

module.exports = router;
