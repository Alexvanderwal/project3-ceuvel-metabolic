var socket = io();
var ph_table = {
  0: "Battery Acid (0)",
  1: "Stomach Acid (1)",
  2: "Lemon Juice (2)",
  3: "Orange Juice (3)",
  4: "Tomato Juice (4)",
  5: "Black Coffee (5)",
  6: "Cow Milk (6)",
  7: '"Pure" Water (7)',
  8: "Seawater (8)",
  9: "Toothpaste (9)",
  10: "Brocoli (10)",
  11: "Household Ammonia (11)",
  12: "Soapy Water (12)"
};

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

socket.on("amqp data", function(data) {
  try {
    var fishAmount = document.getElementById("fishAmount");
    var waterTemperature = document.getElementById("waterTemperature");
    var phLevel = document.getElementById("phLevel");
    var lightOverlay = document.getElementById("lightOverlay");

    if (data.water_temp < 100) {
      waterTemperature.innerHTML = `${data.water_temp.toFixed(1)}C`;
    }

    fishAmount.innerHTML = 8;

    phLevel.innerHTML = ph_table[Math.floor(data.ph)];
    lightOverlay.style.opacity = 1 - (data.lux / 100000).toFixed(2) * 3;
  } catch (e) {
    console.log(e);
  }
});

function createFish() {
  var fishContainer = document.querySelector(".water");
  var fish = document.createElement("div");
  fish.classList.add("catFish");
  fish.dataset.oldX = 0;
  fishContainer.appendChild(fish);
  animateFish();
}

function animateFish() {
  var containerHeight = document.querySelector(".water").offsetHeight;
  var containerWidth = document.querySelector(".water").offsetWidth;
  document.querySelectorAll(".catFish").forEach(fish => {
    var oldX = fish.dataset.oldX;
    var newX = Math.floor(Math.random() * (containerWidth - 100) + 1);
    var newY = Math.floor(Math.random() * (containerHeight - 35) + 1);
    if (oldX < newX) {
      fish.style.transform = "rotateY(180deg)";
      fish.style.top = `${newY}px`;
      fish.style.left = `${newX}px`;
    } else {
      fish.style.transform = "rotateY(0)";
      fish.style.top = `${newY}px`;
      fish.style.left = `${newX}px`;
    }
    fish.dataset.oldX = newX;
  });
  setInterval(function() {
    animateFish();
  }, 10000);
}

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

for (let i = 0; i < 8; i++) {
  console.log("dafuck");
  createFish();
}

window.setInterval(function() {
  socket.emit("heartbeat", {
    msg: "I am NOT dead!"
  });
}, 5000);

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
