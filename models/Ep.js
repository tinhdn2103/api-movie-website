const mongoose = require("mongoose");

const EpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
  },
  ep: {
    type: Number,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
});

module.exports = mongoose.model("Ep", EpSchema);
