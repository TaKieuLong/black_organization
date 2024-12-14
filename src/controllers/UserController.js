const express = require("express");
const User = require("../models/userModel"); // Hypothetical User model
const Post = require("../models/postModel");
// Create a new User
const validateEmail = (email) => {
  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // Minimum password length requirement (adjust as needed)
  const minLength = 8;
  return password.length >= minLength;
};
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json("Email chưa đúng định dạng nè.");
  }

  // Validate password length
  if (!validatePassword(password)) {
    return res.status(400).json("Mật khẩu cần ít nhất 8 ký tự nho.");
  }

  const newUser = new User({ username, email, password });

  try {
    await newUser.save();
    res.status(201).json({
      message: "oke con dê",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("lỗi server ùi.");
  }
};

exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ author: userId }).populate(
      "author",
      "username email"
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: "User không có bài viết nào" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bài viết của user", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, email, password } = req.body;

    if (!id) {
      return res.status(400).send({ mess: "Cần id người dùng" });
    }

    const updatedFields = {};
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;

    const user = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ mess: `Không tìm thấy UserID ${id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: "Cập nhật thông tin người dùng thành công",
    });
  } catch (error) {
    res.status(400).send({ mess: error?.message });
  }
};
// Delete a User by ID
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ mess: "Thiếu thông tin id người dùng" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({ mess: `Không tìm thấy UserID ${id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: `Xóa user ${id} thành công`,
    });
  } catch (error) {
    res.status(400).send({ mess: error?.message });
  }
};
