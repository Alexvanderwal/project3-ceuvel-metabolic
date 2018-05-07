var express = require("express");
var router = express.Router();
var app = express();

app.use(express.json()); // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

router.all("/", function(req, res) {
  res.render("plants/detail.html");
});

module.exports = router;
