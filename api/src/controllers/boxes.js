const db = require("../../util/db-connection.js");

async function getBoxes(req, res) {
  try {
    const data = await db.select().from("boxes");
    res.json(data);
  } catch (error) {
    console.error("Error fetching boxes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getBoxById(req, res) {
  try {
    const { box_id } = req.params;
    const data = await db
      .select()
      .from("boxes")
      .where({ "boxes.box_id": box_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getBoxItems(req, res) {
  try {
    const { box_id } = req.params;
    const data = await db.select().from("items").where({ box_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getBoxItemById(req, res) {
  try {
    const { box_id, item_id } = req.params;
    const data = await db
      .select()
      .from("items")
      .where({ box_id: box_id, item_id: item_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function checkItem(req, res) {
  try {
    const { item_id } = req.params;
    const { is_checked } = req.body;
    const updated = await db("items")
      .where({ item_id })
      .update({ is_checked })
      .returning("*");
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getBoxes,
  getBoxById,
  getBoxItems,
  getBoxItemById,
  checkItem,
};
