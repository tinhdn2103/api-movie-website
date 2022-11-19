const router = require("express").Router();
const verify = require("../verifyToken");
const MyList = require("../models/MyList");
//create

router.post("/", verify, async (req, res) => {
  try {
    const result = await MyList.findOneAndUpdate(
      { movie: req.body.movie, user: req.user.id },
      {
        $set: { movie: req.body.movie, user: req.user.id },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(err);
  }
});

//delete

router.delete("/:id", verify, async (req, res) => {
  try {
    await MyList.findByIdAndDelete(req.params.id);

    res.status(200).json("The movie has been deleted...");
  } catch (error) {
    res.status(500).json(err);
  }
});

//get my list

router.get("/find", verify, async (req, res) => {
  try {
    const myList = await MyList.find({
      user: req.user.id,
    });
    res.status(200).json(myList);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
