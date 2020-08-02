const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const User = require("../models/User")

router.get("/", (req, res) => {
  res.redirect("/home")
})

// Get all the public posts

router.get("/home", async (req, res) => {
  try {
    const posts = await Post.find({ status: "public" })
      .populate("author")
      .sort({ updated_at: "desc" })
      .lean()
    console.log(posts)
    res.render("posts/publicStories", { posts, title: "Bloggers Blog Home" })
  } catch (error) {
    console.error(error)
  }
})

// @route post/add
// GET the form
router.get("/post/add", ensureAuth, (req, res) =>
  res.render("posts/addPost.hbs", { title: "Add new post" })
)

// @route post/add
// POST add a new post
router.post("/post/add", ensureAuth, async (req, res) => {
  try {
    req.body.author = req.user.id
    await Post.create(req.body)
    res.redirect("/home")
  } catch (error) {
    console.error(error)
  }
})

// GET single post
router.get("/post/:id/", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id })
      .populate("author")
      .lean()
    const comments = await Comment.find({ post: req.params.id })
      .populate("user")
      .sort({ updated_at: "desc" })
      .lean()

    if (!post) {
      console.log("no post")
    }

    res.render("posts/singlePost", { post, comments, title: post.title })
  } catch (error) {
    console.error(error)
  }
})

// GET edit post
router.get("/post/edit/:id/", ensureAuth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).lean()

    if (!post) {
      console.log("no post")
    }

    if (post.author != req.user.id) {
      res.redirect("/home")
    } else {
      res.render("posts/editPost", { post, title: `Edit ${post.title}` })
    }
  } catch (error) {
    console.error(error)
  }
})

// PUT edit post
router.put("/post/edit/:id/", ensureAuth, async (req, res) => {
  try {
    req.body.author = req.user.id
    let post = await Post.findOne({ _id: req.params.id })

    if (!post) {
      console.log("no post")
    }

    if (post.author != req.user.id) {
      res.redirect("/home")
    } else {
      post = await Post.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })
      res.redirect("/home")
    }
  } catch (error) {
    console.error(error)
  }
})

// DELETE post id
router.delete("/post/delete/:id/", ensureAuth, async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id })
    res.redirect("/home")

    // if (post.author != req.user.id) {
    //   res.redirect("/home")
    // } else {
    //   res.redirect("/home")
    // }
  } catch (error) {
    console.error(error)
  }
})

// Get logged in user posts
router.get("/posts/user/:username/:id", ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate("author")
      .sort({ updated_at: "desc" })
      .lean()

    if (!posts) {
      console.log("no posts")
    }

    if (req.user.id != req.params.id) {
      res.redirect("/")
    } else {
      res.render("posts/publicStories", {
        posts,
        title: `${req.params.username} posts`,
      })
    }
  } catch (error) {
    console.error(error)
  }
})

// Get logged in user posts
router.get("/posts/user/:id", ensureAuth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id, status: "public" })
      .populate("author")
      .sort({ updated_at: "desc" })
      .lean()
    const user = await User.findById({ _id: req.params.id })

    if (!posts) {
      console.log("no posts")
    }
    res.render("posts/publicStories", {
      posts,
      title: `${user.username} Posts`,
    })
  } catch (error) {
    console.error(error)
  }
})

// Get searched post
router.get("/posts/search/", ensureAuth, async (req, res) => {
  try {
    if (req.query.q) {
      const posts = await Post.find({
        $text: { $search: req.query.q },
        status: "public",
      })
        .populate("author")
        .sort({ updated_at: "desc" })
        .lean()
      if (!posts) {
        console.log("no posts")
      }
      res.render("posts/publicStories", {
        posts,
        title: `Search results for ${req.query.q}`,
      })
    }
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
