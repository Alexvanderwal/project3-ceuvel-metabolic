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
var GoogleSpreadsheet = require("google-spreadsheet");

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet("1EDrYJVT3SmK1cdXxY6-YobDNkiipUDE9zd1pos40-sY");
var sheet;

// async.series(
//   [
//     function setAuth(step) {
//       // see notes below for authentication instructions!
//       var creds = require("./generated-creds.json");
//       // OR, if you cannot save the file locally (like on heroku)
//       //   var creds = {
//       //     client_email: 'fetcher@rising-city-204109.iam.gserviceaccount.com"',
//       //     private_key:
//       //       "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkkzNfFCkeanAM\nHJLCV9YpNETxTdY6AmkzLxSlCA53nhVLppdDc2gRK8kYtGuKjmqnIeaf0AzV/ma9\nQ6hXwUlRzdbqDvLLGwROhz/WYXV/vdbMDbyOKx2JssK1Vqp2IfyfmNAVQYIG8Tv5\nfGFv5d+OMRzRdzXUWx2dS3Uw3C7TTdpEvaCLSDDrrcchuwuhsuC4qOdtGjGvzmLZ\ncuH0e2V0d3Aw/KhqVbXK193b3ZGcA4xdbR/PXKmUHeHyyMzraKpItiL61nxsWZDa\nOwYbuBvjyQNq3MKDbdHQO/3qyp9c1FjDu0vcXml7NZNE5Ggf9XWnlYE3GoFsqbKW\nxZlh5XgtAgMBAAECggEANQrWc035pLp0a4roCCgsN7KHh+ho4+B0DJGfi0Mp+oai\nYXQLa6tt/p7InSRFRu541G46OQbipDPu5BBC2SnMWkfH/T8dJLYL8M1pl0xpBOdo\nK/M/cujVh9RsKesJXLK+i6fCZR9sa5VjmZjrhJensloE6kQMPumxBUnVNw64LtTz\nymvCT831i4ZLekomljc/KuZzPJS6ppXdSPnCAlEw15ZOfMfOKQOQkwN6K1XTy8oH\ntocNdha2q/3io/zBTiOzP0GSi0oSqhJRRTlq94jRzf+BjG1lJgMxL3qU7Mjf176Q\nFVnRQMMH+GgJxOsJfbM8fncl75bKj1B07GHrHMdKxwKBgQDX03rniwysjn7KGBzI\n9wSeNIvXGpFVKSNoVU1+DRyw2FqxL3S44qA24H/IBqFFEg7YMsut5MBvPJ8CLdGq\ncy6rLH+hxWClRkp8y8bTqJZClDPgJmnrocsV5wldkbWn8S7OiOwJ1wRR3/gvk1bI\nHVFWq+GkEs/iit6hYAS4eVGtzwKBgQDDNYJwh6lieKMEYAS/KzNqSQvexTNDP90s\nmNibB5meKR43v4qUGDqA0Tga46C4zCHIg9KrasGxaoXgsrbZCYS0RvSbGS1pxy3v\n7Uks9Dj5sOmpGEK0a4AFRRYwP2omF6IsOUWHCTiC9UV+1I0qZByVTNMZArX86Xoa\nr/vBqU0VQwKBgDx5EhfsmymCZ75CkVYx+IZHnOMxm4UsGLK0LBlknSRkCs1YybDA\nNzoJH2SxjuBmleg4G1/nF5BTgQ5APl4vFeV6e2ydfF3y2w4qntRRiYCwO/TTbpxK\nYjgJ21Lvb+HVr1LJhLGhIKG8SrMx6n/5zv+k+31YlA0a8hRvbgMuYxd7AoGBAKSY\nSrrNeIIiC/oVaAs0xu54VvzoM9ghUkFXQ1Q8rUeRjfwdkiBa6YFSZ8csZYlL/bRP\nimOk6VrJ4cZbihcokm9bYMYiDYuiOVaTMd8osZ2/kNVWMnBkMBbBcPsPjVY/GSvG\nwpwgpziszIMrfzfeH8e3dkshYQe2aZF1D4b0VJ13AoGBALPN4X1fb0NRYCx/fGVz\nOXgP5RJQtB7wB4N5VWEeMFJ0Gm88tKxlqRJk+bxqQuW0MDLCqnW889lZ1U0wMceE\ng1Db4q+AWEQExMlLz44AtNY1owLLiOTIQnXUnJYN+HpNQ1qcQe5wetZQhL55eWRD\nX7mghaVLVhFPfW2hbdhOdXVO\n-----END PRIVATE KEY-----\n"
//       //   };

//       doc.useServiceAccountAuth(creds, step);
//     },
//     function getInfoAndWorksheets(step) {
//       doc.getInfo(function(err, info) {
//         console.log("Loaded doc: " + info);
//         sheet = info.worksheets[0];
//         console.log(
//           "sheet 1: " +
//             sheet.title +
//             " " +
//             sheet.rowCount +
//             "x" +
//             sheet.colCount
//         );
//         step();
//       });
//     },
//     function workingWithRows(step) {
//       // google provides some query options
//       sheet.getRows(
//         {
//           offset: 1,
//           limit: 20,
//           orderby: "col2"
//         },
//         function(err, rows) {
//           console.log("Read " + rows.length + " rows");

//           // the row is an object with keys set by the column headers
//           rows[0].colname = "new val";
//           rows[0].save(); // this is async

//           // deleting a row
//           rows[0].del(); // this is async

//           step();
//         }
//       );
//     },
//     function workingWithCells(step) {
//       sheet.getCells(
//         {
//           "min-row": 1,
//           "max-row": 5,
//           "return-empty": true
//         },
//         function(err, cells) {
//           var cell = cells[0];
//           console.log(
//             "Cell R" + cell.row + "C" + cell.col + " = " + cell.value
//           );

//           // cells have a value, numericValue, and formula
//           cell.value == "1";
//           cell.numericValue == 1;
//           cell.formula == "=ROW()";https://drive.google.com/drive/recent

//           // updating `value` is "smart" and generally handles things for you
//           cell.value = 123;
//           cell.value = "=A1+B2";
//           cell.save(); //async

//           // bulk updates make it easy to update many cells at once
//           cells[0].value = 1;
//           cells[1].value = 2;
//           cells[2].formula = "=A1+B1";
//           sheet.bulkUpdateCells(cells); //async

//           step();
//         }
//       );
//     },
//     function managingSheets(step) {
//       doc.addWorksheet(
//         {
//           title: "my new sheet"
//         },
//         function(err, sheet) {
//           // change a sheet's title
//           sheet.setTitle("new title"); //async

//           //resize a sheet
//           sheet.resize({ rowCount: 50, colCount: 20 }); //async

//           sheet.setHeaderRow(["name", "age", "phone"]); //async

//           // removing a worksheet
//           sheet.del(); //async

//           step();
//         }
//       );
//     }
//   ],
//   function(err) {
//     if (err) {
//       console.log("Error: " + err);
//     }
//   }
// );

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
