const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,//Mongoose schemas support a timestamps option. If you set timestamps: true , Mongoose will add two properties of type Date to your schema: createdAt : a date representing when this document was created. updatedAt : a date representing when this document was last updated.
  }
);

module.exports = mongoose.model("Messages", MessageSchema);
