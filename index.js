const express = require("express");
const app = express();
const fs = require("fs");

require("./setup");

app.use("/api", require("./api"));
app.use("/api/admin", require("./admin"));
app.use(express.static("static"));

app.listen(80, () => console.log("Ready"));
