const express = require("express");
const nunjucks = require("nunjucks");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var router = express.Router();
var fish = require("./fish/");
var plants = require("./plants/");
var amqp = require("amqplib");
var async = require("async");

amqp
  .connect("amqp://consumer:zHJR6WPpgUDLt5cF@rabbit.spectral.energy/")
  .then(function(conn) {
    process.once("SIGINT", function() {
      conn.close();
    });
    return conn.createChannel().then(function(channel) {
      channel
        .assertExchange("aquaponics", "topic", { durable: true })
        .then(result => {
          var queue = channel.assertQueue("", { exclusive: true });
          queue = queue.then(function(_queue) {
            channel.bindQueue(_queue.queue, "aquaponics", "deceuvel");
            console.log(_queue);
            return channel.consume(
              _queue.queue,
              function(msg) {
                io.emit("amqp data", JSON.parse(msg.content.toString()));
                console.log(" [x] Received '%s'", msg.content.toString());
              },
              { noAck: true }
            );
          });
          return queue.then(function(_consumeOk) {
            console.log(" [*] Waiting for messages. To exit press CTRL+C");
          });
        });
    });
  });

var restaurant = require("./restaurant/");
var restroom = require("./restroom/");
//0.0.0.0 instead of 127.0.0.1 forces the server to redirect to the local endpoints instead of the exposed local endpoints

app
  .set("view engine", "html")
  .use(express.static("./static"))
  .use("/fish", fish.paths)
  .use("/plants", plants.paths)
  .use("/restaurant", restaurant.paths)
  .use("/restroom", restroom.paths)
  .use("/", homepage);

http.listen(3000, "0.0.0.0", serverSetup);

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

io.on("connection", socketConnection);
io.on('heartbeat', (data) => console.log(data.clg));

function socketConnection(socket) {
  console.log("User is connected");
  socket.emit("crop data", {
    plants: {
      lettuce: {
        perM2: 5,
        weightInKg: 0.36,
        totalM2: 22.5,
        yield: { lastMonth: 50, currentMonth: 15 }
      },
      herbs: {
        perM2: 2,
        weightInKg: 0.4,
        totalM2: 22.5,
        yield: { lastMonth: 20, currentMonth: 15 }
      },
      flowers: {
        perM2: 5,
        weightInKg: 0.15,
        totalM2: 22.5,
        yield: { lastMonth: 30, currentMonth: 15 }
      }
    },
    harvestInterval: 3,
    lastHarvested: "2018-05-14"
  });
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
