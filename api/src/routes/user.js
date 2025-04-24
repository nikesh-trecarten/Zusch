const express = require("express");
const router = express.Router();
const { getUser, updateUser } = require("../controllers/user.js");
const { requireAuth } = require("../../middlewares/requireAuth.js");

router.get("/", requireAuth, getUser);
router.patch("/", requireAuth, updateUser);

module.exports = router;
