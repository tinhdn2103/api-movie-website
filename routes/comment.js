const router = require("express").Router();
const Comment = require("../models/Comment");
const verify = require("../verifyToken");

//create

router.post("/", verify, async (req, res) => {
  const { movie, user, comment } = req.body;
  const newComment = new Comment({ movie, user, comment });
  try {
    const comment = await newComment.save();
    await comment.populate({
      path: "user",
      select: ["username", "profilePic"],
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update

router.put("/:id", verify, async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete

router.delete("/:id", verify, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("The comment has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get list comments of movie

router.get("/list/:id", verify, async (req, res) => {
  try {
    const comments = await Comment.find({ movie: req.params.id }).populate({
      path: "user",
      select: ["username", "profilePic"],
    });
    comments.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
