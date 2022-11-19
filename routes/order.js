const router = require("express").Router();
const Order = require("../models/Order");
const verify = require("../verify");

router.get("/find", verify, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      endAt: { $gte: new Date() },
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
