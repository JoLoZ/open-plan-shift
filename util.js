const fs = require("fs");
const crypto = require("crypto");

module.exports.config = (key = undefined, value = undefined) => {
    let data = JSON.parse(fs.readFileSync("config.json"));
    if (value != undefined) {
        console.log("Setting config", key, "to", value);
        data[key] = value;
        fs.writeFileSync("config.json", JSON.stringify(data));
        return value;
    }
    if (key != undefined) {
        return data[key];
    }
    return data;
};

module.exports.hash = (input) => {
    if (typeof input != "string") {
        throw new Error("Wrong token format");
    }
    return crypto.createHash("sha256").update(input).digest("hex");
};

module.exports.hasPerm = (token, perm) => {
    if (!fs.existsSync(`secrets/${this.hash(token)}.json`)) {
        return false;
    }
    return JSON.parse(
        fs.readFileSync(`secrets/${this.hash(token)}.json`, "utf-8")
    ).permissions.includes(perm);
};
