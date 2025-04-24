async function showWelcomeMessage(req, res) {
  return res.json({ msg: "API is up and running" });
}

module.exports = { showWelcomeMessage };
