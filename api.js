const router = require("express").Router();
const fs = require("fs");
const { config } = require("./util");

router.get("/config", (req, res) => {
    res.json(config());
});

module.exports = router;
