const express = require("express");
const app = express();

app.get("/", homepage).listen(3000, serverSetup);

function homepage(request, response) {
  response.send("This is a test");
}

function serverSetup() {
  console.log("Server is setup on 3000");
}
