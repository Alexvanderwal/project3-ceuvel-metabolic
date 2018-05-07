const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

//0.0.0.0 instead of 127.0.0.1 forces the server to redirect to the local endpoints instead of the exposed local endpoints

app.get("/", homepage).listen(3000, "0.0.0.0", serverSetup);

io.on("connection", socketConnection);

function socketConnection(socket) {
  console.log("User is connected");
  socket.on("disconnect", function() {
    console.log("User disconnected");
  });
}

function homepage(request, response) {
  response.send("This is a test");
}

function serverSetup() {
  console.log("Server is setup on 3000");
}
