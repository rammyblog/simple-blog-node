const User = require("../models/User")
// const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        console.log(user)
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." })
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "Incorrect password." })
        }
        return done(null, user)
      })
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
