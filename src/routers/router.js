const express = require("express");
const router = express.Router();

const user = require("./users/user");
const post = require("./posts/post");

router.use("/user", user);
router.use("/post", post);

module.exports = router;
