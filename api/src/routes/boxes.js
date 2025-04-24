const express = require("express");
const router = express.Router();
const {
  getBoxes,
  getBoxById,
  getBoxItems,
  getBoxItemById,
  addBox,
  deleteBox,
  addItem,
  checkItem,
} = require("../controllers/boxes");
const { requireAuth } = require("../../middlewares/requireAuth.js");

router.get("/", getBoxes);
router.get("/:box_id", getBoxById);
router.get("/:box_id/items", getBoxItems);
router.get("/:box_id/items/:item_id", getBoxItemById);
router.post("/", requireAuth, addBox);
router.delete("/:box_id", requireAuth, deleteBox);
router.post("/:box_id/items", requireAuth, addItem);
router.patch("/:box_id/items/:item_id", checkItem);

module.exports = router;
