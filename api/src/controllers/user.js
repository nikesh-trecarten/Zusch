const db = require("../../util/db-connection.js");

async function getUser(req, res) {
  const user_id = req.auth.userId;
  try {
    const data = await db.select().from("users").where({ user_id });
    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const user_id = req.auth.userId;
  const { street, house_number, postal_code, city, country } = req.body;
  try {
    const updates = Object.fromEntries(
      Object.entries({
        street,
        house_number,
        postal_code,
        city,
        country,
      }).filter(([_, value]) => value !== undefined)
    );

    const result = await db("users").where({ user_id }).update(updates);
    if (result === 0) {
      return res.status(404).json({ error: "Unable to find user" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getUser, updateUser };
