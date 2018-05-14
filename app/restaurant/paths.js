const express = require("express");
const router = express.Router();
const app = express();

app.use(express.json()); // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

router.all("/", function(req, res) {
  res.render("restaurant/detail.html", { detailview: "True" });
});

module.exports = router;
