const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const SALT_WORK_FACTOR = 10
const validateEmail = require("../utils/emailValidator")

const UserSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
    unique: true,
    createIndexes: { unique: true },
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: [validateEmail, "Invalid email"],
    createIndexes: { unique: true },
  },
  password: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (error) {
    return next(err)
  }
})

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password)
}

module.exports = mongoose.model("User", UserSchema)
