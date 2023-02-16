const { exec } = require("child_process");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { closeApp } = require("./server");
const { hasPerm, config, hash } = require("./util");

router.use(express.json());

router.use((req, res, next) => {
    if (!hasPerm(req.query.token, "admin")) {
        res.status(403).json({ error: true, code: 403 });
        return;
    }
    next();
});

router.get("/config/language", (req, res) => {
    config("language", req.query.lang);
    res.json(config());
});
router.get("/config/theme", (req, res) => {
    config("theme", req.query.theme);
    res.json(config());
});

router.get("/update", (req, res) => {
    closeApp();

    //Start up temp server
    let temp = express();
    temp.all("*", (req, res) => {
        res.send(fs.readFileSync("./static/maintenance.html", "utf-8"));
    });
    temp.listen(3001);

    //Actually update
    console.log("Updating...");
    console.log("Running git pull");
    exec("git pull");
    console.log("Running NPM install");
    exec("npm i");
    console.log("Done");
    process.exit();
});

router.get("/secret/add", (req, res) => {
    let user = {
        name: req.query.name,
        permissions: req.query.permissions.split(","),
    };
    fs.writeFileSync(
        `secrets/${hash(req.query.key)}.json`,
        JSON.stringify(user)
    );
    res.json(user);
});
router.get("/secret/remove", (req, res) => {
    if (!fs.existsSync(`secrets/${hash(req.query.key)}.json`)) {
        res.json(false);
        return;
    }
    fs.rmSync(`secrets/${hash(req.query.key)}.json`);
    res.json(true);
});

module.exports = router;
