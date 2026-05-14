const express = require("express");
const users = require("../data/users.json");

const router = express.Router();

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    joinedAt: user.joinedAt,
  });
});

module.exports = router;
