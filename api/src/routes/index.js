const express = require("express");
const router = express.Router();
const {
  showWelcomeMessage,
  registerNewUser,
} = require("../controllers/index.js");
const { requireAuth } = require("../../middlewares/requireAuth.js");

router.get("/", showWelcomeMessage);
router.post("/register", requireAuth, registerNewUser);

module.exports = router;
