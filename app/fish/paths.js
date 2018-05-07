var express = require("express");
var router = express.Router();
var app = express();

app.use(express.json()); // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

router.all("/", function(req, res) {
  res.send("detailview for fish will be here");
});

module.exports = router;
