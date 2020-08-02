const express = require("express")
const passport = require("passport")
const User = require("../models/User")
const { promisify } = require("util")
const router = express.Router()

router.get("/login", (req, res) => {
  res.render("auth/login")
})
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
)

router.get("/register", (req, res) => {
  res.render("auth/register")
})

router.post("/register", async (req, res) => {
  try {
    const user = await new User(req.body)
    await user.save()
    try {
      await req.login(user, function (err) {
        if (err) {
          return next(err)
        }
        return res.redirect("/")
      })
    } catch (error) {
      throw error
    }

    // req.flash("success_msg", "Login success")
    // return res.redirect("/")
  } catch (error) {
    console.log(error)
    throw error
  }
})

router.get("/logout", async (req, res) => {
  try {
    req.logOut()
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})
module.exports = router
