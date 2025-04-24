const db = require("../../util/db-connection.js");

async function showWelcomeMessage(req, res) {
  return res.json({ msg: "API is up and running" });
}

async function registerNewUser(req, res) {
  const user_id = req.auth.userId;
  const { street, house_number, postal_code, city, country } = req.body;
  try {
    if (!street || !house_number || !postal_code || !city || !country) {
      return res
        .status(400)
        .json({ error: "Please fill in the form completely to register" });
    }

    const newUser = await db("users")
      .insert({
        user_id,
        street,
        house_number,
        postal_code,
        city,
        country,
      })
      .returning("*");
    res.json({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}

module.exports = { showWelcomeMessage, registerNewUser };
