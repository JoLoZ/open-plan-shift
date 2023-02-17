const fs = require("fs");
const crypto = require("crypto");
const { hash } = require("./util");

const defaultAdmin = {
    name: "Admin",
    permissions: ["superadmin", "admin", "self", "view"],
};

console.log("Running startup checks...");
if (!fs.existsSync("secrets")) {
    fs.mkdirSync("secrets");
    //Generate default admin access
    let token = crypto.randomBytes(20).toString("hex");
    fs.writeFileSync(
        `secrets/${hash(token)}.json`,
        JSON.stringify(defaultAdmin)
    );
    console.log(
        "IMPORTANT! After this message, there's your admin token. Treat this token like a password! Token:",
        token
    );
}
if (!fs.existsSync("config.json")) {
    fs.writeFileSync("config.json", "{}");
}
if (!fs.existsSync("plans")) {
    fs.mkdirSync("plans");
}
console.log("Startup checks complete!");
