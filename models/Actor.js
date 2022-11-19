const mongoose = require("mongoose");

const ActorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
  },

  img: {
    type: String,
  },

  desc: {
    type: String,
  },
});

module.exports = mongoose.model("Actor", ActorSchema);
