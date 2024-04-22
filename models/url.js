const mongoose = require("mongoose");
const urlschema = new mongoose.Schema(
  {
    shortID: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visithistory: [{ timestamp: { type: Number } }],
    // createdBy used so that user can see only its url list
    // ref means reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
const URL = mongoose.model("url", urlschema);
module.exports = URL;
