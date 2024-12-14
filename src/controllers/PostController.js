const express = require("express");
const Post = require("../models/postModel"); // Hypothetical Post model
const User = require("../models/userModel"); // Hypothetical Post model

// Create a new Post
exports.createPost = async (req, res) => {
  const { title, content, author } = req.body;

  try {
    const user = await User.findById(author);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const post = new Post({
      title,
      content,
      author,
    });

    await post.save();

    user.post = post._id;
    await user.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
  }
};

// Read a Post by ID
exports.readPost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).send({ mess: "Thiếu thông tin id Post" });
    }

    const post = await Post.findById(id)
      .populate({
        path: "userId",
        select:
          "-password -status -createdAt -updatedAt -posts -__v -avatar -_id",
      })
      .exec();

    if (!post) {
      return res.status(404).send({ mess: `Không tìm thấy Post ${id}` });
    }

    res.send({
      data: post,
      mess: `Thông tin Post ${post?.title}`,
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

// Update a Post by ID
exports.updatePost = async (req, res) => {
  try {
    const { id, title, content } = req.body;

    if (!id) {
      return res.status(404).send({ mess: "Thiếu thông tin id Post" });
    }

    const updatedFields = {};
    if (content) updatedFields.content = content;
    if (title) updatedFields.title = title;

    const post = await Post.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).send({ mess: `Không tìm thấy PostId ${id}` });
    }

    res.send({
      data: post,
      mess: `Cập nhật thông tin Post ${post?.title}`,
    });
  } catch (error) {
    res.status(400).send({ mess: error?.message });
  }
};

// Delete a Post by ID
exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).send({ mess: "Thiếu thông tin id Post" });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      const updatedUser = await User.findByIdAndUpdate(
        post.userId,
        {
          $pull: { posts: id },
        },
        { new: true }
      );
    } else {
      return res.status(404).send({ mess: `Không tìm thấy PostId &{id}` });
    }

    res.send({
      data: post,
      mess: `Xóa Post ${id} thành công`,
    });
  } catch (error) {
    res.status(400).send({ mess: error?.message });
  }
};
