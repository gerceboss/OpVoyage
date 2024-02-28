const express = require("express");
const router = express.Router();

const blockController = require("./../controllers/blockController");

router.get("/latest", blockController.latestBlock);
router.get("/all", blockController.getAllBlocks);
router.get("/:num", blockController.latestBlockByNumber);

module.exports = router;
