const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Post = require("../models/Post")
router.get("/home", (req, res) => res.render("home/home"))

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

module.exports = router
