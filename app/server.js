const express = require("express");
const nunjucks = require("nunjucks");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var router = express.Router();
var fish = require("./fish/");
var plants = require("./plants/");
var amqp = require("amqplib");
var ampqTest = require("amqp");
// amqp://consumer:zHJR6WPpgUDLt5cF@rabbit.spectral.energy/
// var connection = amqpTest.createConnection(
//   {
//     host: "rabbit.spectral.energy",
//     login: "consumer",
//     password: "zHJR6WPpgUDLt5cF@r",
//     vhost: "/"
//   },
//   { defaultExchangeName: "aquaponics" }
// );

// connection.on("ready", function() {
//   connection.exchange("aquaponics");
// });

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

// // add this for better debuging
// connection.on("error", function(e) {
//   console.log("Error from amqp: ", e);
// });

// // Wait for connection to become established.
// connection.on("ready", function() {
//   // Use the default 'amq.topic' exchange
//   connection.queue("my-queue", function(q) {
//     // Catch all messages
//     q.bind("#");

//     // Receive messages
//     q.subscribe(function(message) {
//       // Print messages to stdout
//       console.log(message);
//     });
//   });
// });

//0.0.0.0 instead of 127.0.0.1 forces the server to redirect to the local endpoints instead of the exposed local endpoints

app
  .set("view engine", "html")
  .use(express.static("./static"))
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
