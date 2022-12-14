const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");
//create

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();

      const py = spawn("python", ["vectorizerMovie.py"]);
      py.stdout.on("data", async (data) => {
        console.error(`stdout: ${data}`);
      });
      py.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
      py.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });

      res.status(201).json(savedMovie);
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
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
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
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("The movie has been deleted...");
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
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get random

router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all

router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    req.status(403).json("You are not allowed!");
  }
});

//get list of type

//search
//get random

router.get("/search", verify, async (req, res) => {
  const title = req.query.q;
  const py = spawn("python", ["search.py", title]);
  py.stdout.on("data", async (data) => {
    data = data.toString();
    data = data.replace(/'/g, '"');
    data = JSON.parse(data);
    res.status(200).json(data);
  });

  py.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).json(`stderr: ${data}`);
  });
  py.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
  // exec("python search.py " + title, (error, stdout, stderr) => {
  //   if (error) {
  //     res.status(500).json(error);
  //     return;
  //   }
  //   if (stderr) {
  //     res.status(500).json(stderr);
  //     return;
  //   }
  //   data = stdout.toString();
  //   data = data.replace(/'/g, '"');
  //   data = JSON.parse(data);
  //   res.status(200).json(data);
  // });
  // PythonShell.run("search.py", { args: [title] }, function (err, results) {
  //   if (err) throw err;
  //   // Results is an array consisting of messages collected during execution
  //   console.log("results: ", results[0]);
  // });
});

module.exports = router;
