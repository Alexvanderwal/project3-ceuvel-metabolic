var socket = io();

// socket.on("amqp data", function(data) {
//   try {
//     var water_temperature = document.getElementById("water_temperature");
//     var ph_level = document.getElementById("ph_level");
//     if (data.water_temp < 100) {
//       water_temperature.innerHTML = data.water_temp;
//     }
//     ph_level.innerHTML = data.ph;
//   } catch (e) {
//     console.log(e);
//   }
// });
// lettuce: {
//     perM2: 5,
//     weightInKg: 0.36,
//     totalM2: 22.5,
//     yield: { lastMonth: 50, currentMonth: 15 }
//   },
function calcAmount(crop, amount) {
  return crop.perM2 * crop.totalM2 / amount;
}
let dummyDivLettuce = document.createElement("div");
fetch("http://localhost:3000/plants/dispatch-lettuce", {
  credentials: "same-origin",
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
})
  .then(resp => {
    return resp.text();
  })
  .then(response => {
    dummyDivLettuce = dummyDivLettuce.innerHTML = response;
    console.log(dummyDivLettuce);
  });

let rows = {
  lettuce: {
    container: document.getElementById("lettuce"),
    html: dummyDivLettuce
  },
  herbs: {
    container: document.getElementById("herbs"),
    html: dummyDivLettuce
  },
  flowers: {
    container: document.getElementById("flowers"),
    html: dummyDivLettuce
  }
};

socket.on("crop data", function(data) {
  for (key in rows) {
    for (let i = 0; i < calcAmount(data.plants[key], 10); i++) {
      console.log(rows[key].html.innerHTML);
      let extraDiv = document.createElement("div");
      extraDiv = rows[key].html.cloneNode(true);
      rows[key].container.appendChild(extraDiv);
      document.getElementById("plant-data").innerHTML = rows[key].container;
    }
  }
});

function navigate(href) {
  //   console.log(href);
  let links = document.querySelectorAll(".readmore");
  console.log(links);
  for (link of links) {
    console.log(link);
    if (link !== href) {
      link.style.background = "rgba(0,0,0,0.50)";
    }
    link.querySelector("svg").style.opacity = 0;
  }
  let shipBody = document.querySelector(".shipBody");
  shipBody.style.zIndex = 6;
}
// Barba.transitionLength = 1000;

var HideShowTransition = Barba.BaseTransition.extend({
  start: function() {
    this.newContainerLoading.then(this.finish.bind(this));
  },

  finish: function() {
    document.body.scrollTop = 0;
    this.done();
  }
});
Barba.Pjax.start();
Barba.Dispatcher.on("newPageReady", function(
  currentStatus,
  oldStatus,
  container
) {
  for (key in rows) {
    rows[key].temporaryData = rows[key].container.innerHTML;
  }
});
Barba.Dispatcher.on("transitionCompleted", function(currentStatus) {
  for (key in rows) {
    document.getElementById(key).innerHTML = rows[key].temporaryData;
  }
});
