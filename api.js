const router = require("express").Router();
const fs = require("fs");
const { config } = require("./util");

router.get("/config", (req, res) => {
    res.json(config());
});

router.get("/translation", (req, res) => {
    res.json(
        JSON.parse(
            fs.readFileSync(
                `translations/${config("language") || "en"}.json`,
                "utf-8"
            )
        )
    );
});

module.exports = router;
