const express = require("express");
const users = require("../data/users.json");

const router = express.Router();

router.get("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinDate: user.joinDate,
  });
});

module.exports = router;
