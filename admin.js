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
    config("language", req.query.language);
    res.json(config());
});
router.get("/config/theme", (req, res) => {
    config("theme", req.query.theme);
    res.json(config());
});
router.get("/config/title", (req, res) => {
    config("title", req.query.title);
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
    res.json(true);
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
    if (fs.existsSync(`secrets/${hash(req.query.key)}.json`)) {
        fs.rmSync(`secrets/${hash(req.query.key)}.json`);
        res.json(true);
        return;
    }
    if (fs.existsSync(`secrets/${req.query.key}.json`)) {
        fs.rmSync(`secrets/${req.query.key}.json`);
        res.json(true);
        return;
    }
    res.json(false);
});
router.get("/secrets/list", (req, res) => {
    let secrets = [];
    let files = fs.readdirSync("secrets");

    for (const file of files) {
        secrets.push({
            hash: file.slice(0, -5),
            ...JSON.parse(fs.readFileSync(`secrets/${file}`, "utf-8")),
        });
    }

    res.json(secrets);
});

router.get("/plan/:day/add", (req, res) => {
    let data = getExistingPlanData(req.params.day);
    //Add new data
    data.push({
        group: req.query.group || "",
        lesson: req.query.lesson || "",
        subject: req.query.subject || "",
        teacher: req.query.teacher || "",
        room: req.query.room || "",
        note: req.query.note || "",
    });

    fs.writeFileSync(
        `plan/${req.params.day}/${Date.now()}.json`,
        JSON.stringify(data)
    );

    res.json(data);
});
router.get("/plan/:day/remove/:number", (req, res) => {
    let data = getExistingPlanData(req.params.day);
    //Remove entry
    data.splice(req.params.number, 1);

    fs.writeFileSync(
        `plan/${req.params.day}/${Date.now()}.json`,
        JSON.stringify(data)
    );

    res.json(data);
});

function getExistingPlanData(day) {
    let data = [];
    if (!fs.existsSync(`plan/${day}`)) {
        fs.mkdirSync(`plan/${day}`);
    } else {
        let name = fs.readdirSync(`plan/${day}`).sort().reverse()[0];
        if (name != undefined) {
            data = JSON.parse(fs.readFileSync(`plan/${day}/${name}`));
        }
    }
    return data;
}

router.get("/version", (req, res) => {
    res.json(fs.readFileSync("version", "utf-8"));
});

module.exports = router;
