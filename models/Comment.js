const mongoose = require("mongoose")

const { Schema, model } = mongoose

const CommentSchema = new Schema(
  {
    content: {
      required: true,
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

module.exports = model("Comment", CommentSchema)
