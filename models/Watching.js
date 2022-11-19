const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WatchingSchema = new Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ep: {
      type: Number,
      required: true,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    currentTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Watching", WatchingSchema);
