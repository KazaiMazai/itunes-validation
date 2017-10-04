var express = require("express");
var sandbox = require("./api/0.1/sandbox");
var production = require("./api/0.1/production");
var app = express();

app.set("port", (process.env.PORT || 8443));

app.use("/0.1/sandbox", sandbox);
app.use("/0.1/validate", production);

var server = app.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
});

module.exports = server;