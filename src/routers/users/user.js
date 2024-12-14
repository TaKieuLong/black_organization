const express = require("express");
const router = express.Router();
const UseController = require("../../controllers/UserController");

router.post("/create-user", UseController.createUser);
router.get("/users/:userId/posts", UseController.getUserPosts);

module.exports = router;
