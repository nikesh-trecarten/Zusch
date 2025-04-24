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

async function addBox(req, res) {
  const user_id = req.auth.userId;
  const { location } = req.body;
  try {
    await db("boxes").insert({
      user_id,
      location,
    });
    res.json({ message: "Box placed in map" });
  } catch (error) {
    console.error("Error placing box in map:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteBox(req, res) {
  const user_id = req.auth.userId;
  const { box_id } = req.params;
  try {
    const result = await db("boxes").where({ box_id, user_id }).del();
    if (result === 0) {
      return res
        .status(404)
        .json({ error: "Unable to find box for this user" });
    }
    res.json({ message: "Box deleted" });
  } catch (error) {
    console.error("Error deleting box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function addItem(req, res) {
  const user_id = req.auth.userId;
  const { box_id } = req.params;
  const { item_name } = req.body;

  try {
    const box = await db("boxes").where({ box_id, user_id }).first();
    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }
    const result = await db("items")
      .insert({
        box_id,
        item_name,
      })
      .returning("*");
    res.json(result[0]);
  } catch (error) {
    console.error("Error adding item to box:", error);
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
  addBox,
  deleteBox,
  addItem,
  checkItem,
};
