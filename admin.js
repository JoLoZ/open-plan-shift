const express = require("express");
const router = express.Router();
const fs = require("fs");
const { hash, hasPerm, config } = require("./util");

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

module.exports = router;
