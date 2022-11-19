const router = require("express").Router();
const Service = require("../models/Service");
const verify = require("../verify");

//create

router.post("/", verify, async (req, res) => {
  const newService = new Service(req.body);
  try {
    const service = await newService.save();
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update

router.put("/:id", verify, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete

router.delete("/:id", verify, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json("The service has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get list service

router.get("/list", verify, async (req, res) => {
  try {
    const services = await Service.find({ status: true });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
