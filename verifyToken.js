const jwt = require("jsonwebtoken");
const Order = require("./models/Order");

const verify = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "You are not authenricated!" });

  jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });
    req.user = user;
    if (!user.isAdmin) {
      try {
        const orders = await Order.find({
          user: req.user.id,
          endAt: { $gte: new Date() },
        });
        if (orders.length === 0)
          return res.status(403).json({ message: "Account is not active!" });
        next();
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      next();
    }
    // next();
  });
};

module.exports = verify;
