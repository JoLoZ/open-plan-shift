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

router.get("/plan/:day", (req, res) => {
    if (!fs.existsSync(`plan/${req.params.day}`)) {
        res.status(404).json([]);
        return;
    }
    let data = fs.readdirSync(`plan/${req.params.day}`);
    if (data.length == 0) {
        res.status(404).json([]);
        return;
    }
    data = data.sort().reverse();

    res.json({
        updated: fs.statSync(`plan/${req.params.day}/${data[0]}`).mtimeMs,
        plan: JSON.parse(
            fs.readFileSync(`plan/${req.params.day}/${data[0]}`, "utf-8")
        ),
    });
});

module.exports = router;
