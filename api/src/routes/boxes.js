const express = require("express");
const router = express.Router();
const {
  getBoxes,
  getBoxById,
  getBoxItems,
  getBoxItemById,
  checkItem,
} = require("../controllers/boxes");

router.get("/", getBoxes);
router.get("/:box_id", getBoxById);
router.get("/:box_id/items", getBoxItems);
router.get("/box_id/items/:item_id", getBoxItemById);
router.patch("/box_id/items/:item_id", checkItem);

module.exports = router;
