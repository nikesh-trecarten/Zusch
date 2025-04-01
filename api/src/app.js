const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./util/db-connection.js");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  return res.json({ msg: "API is up and running" });
});

app.get("/users/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await db.select().from("users").where({ user_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/boxes/:box_id", async (req, res) => {
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
});

app.get("/boxes/:box_id/items", async (req, res) => {
  try {
    const { box_id } = req.params;
    const data = await db.select().from("items").where({ box_id: box_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  const { user_name, email, street, house_number, postal_code, city, country } =
    req.body;
  try {
    if (
      !user_name ||
      !email ||
      !street ||
      !house_number ||
      !postal_code ||
      !city ||
      !country
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in the form completely to register" });
    }
    const data = await db.select().from("users").where({ email }).first();
    if (data) {
      return res.status(400).json({
        error: "There is already an account using this email address.",
      });
    }
    const newUser = await db("users")
      .insert({
        user_name,
        email,
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
    res.status(500).json({ error: "Interal server error" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
