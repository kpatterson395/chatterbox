const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose
//   .connect("mongodb://localhost:27017/chatbox")
//   .then(() => {
//     console.log("MONGO CONNECTION OPEN");
//   })
//   .catch((err) => {
//     console.log("mongo connection error!", err);
//   });

const MessageSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// array of user ids for likes
// const Message = mongoose.model("Message", MessageSchema);

// const newmess = new Message({
//   body: "first message!",
//   likes: 2,
// });

// newmess.save();
module.exports = mongoose.model("Message", MessageSchema);
