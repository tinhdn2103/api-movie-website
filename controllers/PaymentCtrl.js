const Payment = require("../models//Payment");
class PaymentCtrl {
  async getPaymentByMonth(req, res) {
    const today = new Date();
    const month = today.getMonth();
    const lastMonth = (month + 11) % 12;
    try {
      const ptm = await Payment.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$createdAt" }, month + 1] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const plm = await Payment.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$createdAt" }, lastMonth + 1] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]);
      const m = ptm[0] ? ptm[0].total : 0;
      const lm = plm[0] ? plm[0].total : 0;
      const growth = lm > 0 ? (100 * (m - lm)) / lm : null;
      res.status(200).json({ payments: m, growth: growth });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async getPaymentsRecently(req, res) {
    if (req.user.isAdmin) {
      try {
        const payments = await Payment.find()
          .sort({ _id: -1 })
          .limit(5)
          .populate({
            path: "order",
            populate: [
              {
                path: "user",
                select: ["username", "profilePic"],
              },
              {
                path: "service",
                select: ["name"],
              },
            ],
          });

        res.status(200).json(payments);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Can't get users!");
    }
  }

  async stats(req, res) {
    try {
      const data = await Payment.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
            total: 1,
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$total" },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
module.exports = new PaymentCtrl();
