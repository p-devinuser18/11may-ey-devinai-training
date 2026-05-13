const express = require("express");
const users = require("../data/users.json");

const router = express.Router();

router.get("/:userId", (req, res) => {
  const user = users[req.params.userId];

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    joinDate: user.joinDate,
  });
});

module.exports = router;
