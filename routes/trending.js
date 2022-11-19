const router = require("express").Router();
const { spawn } = require("child_process");
const verify = require("../verifyToken");

router.get("/find", verify, async (req, res) => {
  const py = spawn("python", ["getTrendingList.py"]);
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
});
module.exports = router;
