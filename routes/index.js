const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Post = require("../models/Post")

router.get("/", (req, res) => {
  res.redirect("/home")
})

// Get all the public posts

router.get("/home", async (req, res) => {
  try {
    const posts = await Post.find({ status: "public" })
      .populate("author")
      .sort({ createdAt: "desc" })
      .lean()

    res.render("posts/publicStories", { posts })
  } catch (error) {
    console.error(error)
  }
})

// @route post/add
// GET the form
router.get("/post/add", ensureAuth, (req, res) =>
  res.render("posts/addPost.hbs")
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
  console.log(req.params)
  try {
    const post = await Post.findById({ _id: req.params.id })
      .populate("author")
      .lean()

    if (!post) {
      console.log("no post")
    }

    res.render("posts/singlePost", { post })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
