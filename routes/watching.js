const router = require("express").Router();
const CountView = require("../models/CountView");
const Movie = require("../models/Movie");
const Watching = require("../models/Watching");
const verify = require("../verifyToken");

//create

router.post("/", verify, async (req, res) => {
  try {
    const newWatching = await Watching.findOneAndUpdate(
      { movie: req.body.movie, user: req.body.user },
      {
        $set: {
          ep: req.body.ep,
          currentTime: req.body.currentTime,
          movie: req.body.movie,
          user: req.body.user,
        },
        $inc: { time: req.body.time },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(newWatching.time);
    const movie = await Movie.findById(req.body.movie);
    if (newWatching.time / (movie.duration * 60) > 0.75) {
      const newCountView = new CountView({
        movie: req.body.movie,
        user: req.body.user,
      });
      await newCountView.save();
      await Movie.findByIdAndUpdate(
        { _id: req.body.movie },
        { $inc: { countView: 1 } }
      );
      await Watching.findByIdAndUpdate(
        { _id: newWatching._id },
        { $set: { time: 0 } }
      );
      console.log("Đã tăng 1 view");
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json(err);
  }
});

//get watching

router.get("/find", verify, async (req, res) => {
  try {
    const watching = await Watching.findOne({
      movie: req.query.movie,
      user: req.query.user,
    });

    res.status(200).json(watching);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
