const mongoose = require("mongoose")
const { Schema } = mongoose
const User = require("./User")

const PostSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: "public",
      enum: ["public", "private"],
    },
    author: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

module.exports = mongoose.model("Post", PostSchema)
