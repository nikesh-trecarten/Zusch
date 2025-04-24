const express = require("express");
const { showWelcomeMessage } = require("../controllers/index.js");

const router = express.Router();

router.get("/", showWelcomeMessage);

module.exports = router;
