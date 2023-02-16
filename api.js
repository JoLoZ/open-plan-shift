const router = require("express").Router();
const fs = require("fs");
const { config, hash } = require("./util");

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

router.get("/permissions", (req, res) => {
    if (!fs.existsSync(`secrets/${hash(req.query.token)}.json`)) {
        res.status(403).json([]);
        return;
    }
    let info = JSON.parse(
        fs.readFileSync(`secrets/${hash(req.query.token)}.json`, "utf-8")
    );
    res.json(info.permissions);
});

module.exports = router;
