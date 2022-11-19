const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DigitalWalletSchema = new Schema(
  {
    payment: {
      type: String,
      ref: "Payment",
      required: true,
    },
    email: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DigitalWallet", DigitalWalletSchema);
