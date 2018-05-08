const express = require("express");
const nunjucks = require("nunjucks");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var router = express.Router();
var fish = require("./fish/");
var plants = require("./plants/");
//0.0.0.0 instead of 127.0.0.1 forces the server to redirect to the local endpoints instead of the exposed local endpoints

app
  .set("view engine", "html")
  .use(express.static("/static"))
  .use("/fish", fish.paths)
  .use("/plants", plants.paths)
  .use("/", homepage)
  .listen(3000, "0.0.0.0", serverSetup);

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

io.on("connection", socketConnection);

function socketConnection(socket) {
  console.log("User is connected");
  socket.on("disconnect", function() {
    console.log("User disconnected");
  });
}

function homepage(request, response) {
  response.render("index");
}

function serverSetup() {
  console.log("Server is setup on 3000");
}
