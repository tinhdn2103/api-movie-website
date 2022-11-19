const router = require("express").Router();
const Ep = require("../models/Ep");
const verify = require("../verifyToken");

//update

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedEp = await Ep.findOneAndUpdate(
        { movie: req.body.movie, ep: req.body.ep },
        {
          $set: req.body,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      res.status(200).json(updatedEp);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    req.status(403).json("You are not allowed!");
  }
});

//delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Ep.findByIdAndDelete(req.params.id);
      res.status(200).json("The ep has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    req.status(403).json("You are not allowed!");
  }
});

//get

router.get("/find/:id", verify, async (req, res) => {
  try {
    const ep = await Ep.findById(req.params.id);
    res.status(200).json(ep);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get list ep of movie

router.get("/list/:id", verify, async (req, res) => {
  try {
    const eps = await Ep.find({ movie: req.params.id });
    eps.sort(function (a, b) {
      return a.ep - b.ep;
    });
    res.status(200).json(eps);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
