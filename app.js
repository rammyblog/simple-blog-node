const express = require("express")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const connectDB = require("./config/db")
const passport = require("passport")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const port = process.env.PORT || 3000

// Passport config
require("./config/passport")(passport)
connectDB()

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
  checkCurrentGreaterOne,
  parseInt,
} = require("./helpers/hbs")
const User = require("./models/User")
// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      checkCurrentGreaterOne,
      parseInt,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
)
app.set("view engine", ".hbs")

// Static folder

app.use(express.static(path.join(__dirname, "public")))

// Sessions
app.use(
  session({
    secret: "crud",
    resave: false,
    saveUninitialized: false,
    // So that it doesn't kick out on server reload
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

//  Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global var
app.use(async function (req, res, next) {
  const user = await User.findById({ _id: req.user.id }).lean()
  res.locals.user = user || null
  next()
})

// Routes
app.use("/", require("./routes/index"))
app.use("/comment", require("./routes/comments"))

app.use("/auth", require("./routes/auth"))

app.listen(port, () => console.log(`Port is running on ${port}`))
