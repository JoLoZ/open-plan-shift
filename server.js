const express = require("express");
const app = express();

let server;

module.exports.runApp = (router) => {
    app.use(router)
    server = app.listen(3001, () => console.log("Ready"));
};

module.exports.closeApp = () => {
    server.close()
};
