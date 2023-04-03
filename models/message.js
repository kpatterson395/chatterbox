const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  //   author: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
