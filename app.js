const express = require("express")
const morgan = require("morgan")
const exphbs = require("express-handlebars")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const connectDB = require("./config/db")
const passport = require("passport")
const mongoose = require("mongoose")
const path = require("path")

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

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    //   helpers: { formatDate, stripTags, truncate, editIcon, select },
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

// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth"))

app.listen(port, () => console.log(`Port is running on ${port}`))
