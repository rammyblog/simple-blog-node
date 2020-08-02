module.exports = {
  ensureAuth: function (req, res, next) {
    if (!req.isAuthenticated()) {
      res.redirect("/auth/login")
    } else {
      return next()
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    } else {
      res.redirect("/dashboard")
    }
  },
}
