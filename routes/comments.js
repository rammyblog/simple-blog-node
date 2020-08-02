const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Post = require("../models/Post")
const Comment = require("../models/Comment")

// @route comment/add
// POST add a new comment
router.post("/add/:id", ensureAuth, async (req, res) => {
  try {
    console.log(req.params)
    req.body.user = req.user.id
    req.body.post = req.params.id
    console.log(req.body)
    await Comment.create(req.body)
    res.redirect(`/post/${req.params.id}`)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
