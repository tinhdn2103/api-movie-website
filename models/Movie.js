const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MovieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    img: {
      type: String,
    },
    imgTitle: {
      type: String,
    },
    trailer: {
      type: String,
    },
    epNum: {
      type: Number,
    },
    year: {
      type: String,
    },
    limit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    rate: {
      type: Number,
    },
    numRate: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
    countView: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
