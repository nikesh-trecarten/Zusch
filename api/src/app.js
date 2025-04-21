const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./util/db-connection.js");
const { clerkMiddleware } = require("@clerk/express");
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

app.use(clerkMiddleware());

const requireAuth = (req, res, next) => {
  if (!req.auth.userId) {
    return next(new Error("Unauthenticated"));
  }
  next();
};

app.use((req, res, next) => {
  if (req.auth?.userId) {
    console.log("Authenticated user ID:", req.auth.userId);
  } else {
    console.log("No authenticated user");
  }
  next();
});

app.post("/register", requireAuth, async (req, res) => {
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
});

app.get("/user", requireAuth, async (req, res) => {
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
});

app.patch("/user", requireAuth, async (req, res) => {
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
});

app.get("/boxes", async (req, res) => {
  try {
    const data = await db.select().from("boxes");
    res.json(data);
  } catch (error) {
    console.error("Error fetching boxes:", error);
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

app.post("/boxes", requireAuth, async (req, res) => {
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
});

app.delete("/boxes/:box_id", requireAuth, async (req, res) => {
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
});

app.get("/boxes/:box_id/items", async (req, res) => {
  try {
    const { box_id } = req.params;
    const data = await db.select().from("items").where({ box_id });
    res.json(data);
  } catch (error) {
    console.error("Error fetching box:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/boxes/:box_id/items/:item_id", async (req, res) => {
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
});

app.post("/boxes/:box_id/items", requireAuth, async (req, res) => {
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
});

app.patch("/boxes/:box_id/items/:item_id", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
