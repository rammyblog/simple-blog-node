const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`connected to ${db.connection.host}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
