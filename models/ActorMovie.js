const mongoose = require("mongoose");

const ActorMovieSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },

  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Actor",
    required: true,
  },

  character: {
    type: String,
  },
});

module.exports = mongoose.model("ActorMovie", ActorMovieSchema);
