const express = require("express");
const { runApp } = require("./server");
const router = express.Router();

require("./setup");

router.use("/api", require("./api"));
router.use("/api/admin", require("./admin"));
router.use(express.static("static"));

runApp(router);
