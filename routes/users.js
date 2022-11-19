const router = require("express").Router();
const User = require("../models//User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");

//update

router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    const { password } = req.body;
    if (password) {
      password = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Can't update!");
  }
});

//delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been delete...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Can't delete!");
  }
});

//get

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all

router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Can't get users!");
  }
});

//get user stats

router.get("/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);
  try {
    const data = await User.aggregate([
      { $match: { isAdmin: false } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user stats by month

router.get("/bymonth", async (req, res) => {
  const today = new Date();
  const month = today.getMonth();
  const lastMonth = (month + 11) % 12;
  try {
    const utm = await User.aggregate([
      {
        $match: {
          $and: [
            {
              $expr: { $eq: [{ $month: "$createdAt" }, month + 1] },
            },
            { isAdmin: false },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const ulm = await User.aggregate([
      {
        $match: {
          $and: [
            {
              $expr: { $eq: [{ $month: "$createdAt" }, lastMonth + 1] },
            },
            { isAdmin: false },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const m = utm[0] ? utm[0].total : 0;
    const lm = ulm[0] ? ulm[0].total : 0;
    const growth = lm > 0 ? (100 * (m - lm)) / lm : null;
    res.status(200).json({ users: m, growth: growth });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
