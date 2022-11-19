const router = require("express").Router();
const Actor = require("../models/Actor");
const verify = require("../verifyToken");

//create

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newActor = new Actor(req.body);
    try {
      const savedActor = await newActor.save();
      res.status(201).json(savedActor);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    req.status(403).json("You are not allowed!");
  }
});

//update

router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedActor = await Actor.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedActor);
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
      await Actor.findByIdAndDelete(req.params.id);
      res.status(200).json("The actor has been deleted...");
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
    const actor = await Actor.findById(req.params.id);
    res.status(200).json(actor);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const actors = await Actor.find();
      res.status(200).json(actors);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    req.status(403).json("You are not allowed!");
  }
});

module.exports = router;
