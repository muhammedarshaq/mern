const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

// Models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Getting the user who creates the post
      const user = await User.findById(req.user.id).select("-password");

      // Creating new post
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      // Save the post in DB and set that post in variable
      const post = await newPost.save();

      // Get the saved post as response
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ msg: "Post Not Found!" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Post Not Found!" });
    }
    res.status(500).send("Server Error!");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // If post not found
    if (!post) {
      return res.status(400).json({ msg: "Post Not Found!" });
    }

    // Check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized!" });
    }

    await post.deleteOne();

    res.json({ msg: "Post Removed!" });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Post Not Found!" });
    }
    res.status(500).send("Server Error!");
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post Already Liked!" });
    }

    // Put like to the post
    post.likes.unshift({ user: req.user.id });

    // Save the likes
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post Hasn't Been Liked!" });
    }

    // Get the post index hat like has to be removed
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    // Remove the like from likes array
    post.likes.splice(removeIndex, 1);

    // Save the likes
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment a post
// @access  Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required!").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Getting the user who creates the post
      const user = await User.findById(req.user.id).select("-password");

      // Getting the post that should be commented
      const post = await Post.findById(req.params.id);

      // Creating new comment object
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      // Add the comment into array
      post.comments.unshift(newComment);

      // Save the post in DB with the comment
      await post.save();

      // Get the saved post as response
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete Comment
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    // Getting the post where the comment has to be removed
    const post = await Post.findById(req.params.id);

    // Pull out the comment that has to be removed
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure that comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment Doesn't Exist!" });
    }

    // Checking the user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized!" });
    }

    // Get the index of post which has the comment that has to be removed
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    // Remove the comment from comments array
    post.comments.splice(removeIndex, 1);

    // Save the likes
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

module.exports = router;
