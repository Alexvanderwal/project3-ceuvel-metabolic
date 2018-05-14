var socket = io();
var fishCount = 8;
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
var water_temp;
var phlevel;
var lux;
socket.on("amqp data", function(data) {
  try {
    var fishAmount = document.getElementById("fishAmount");
    var waterTemperature = document.getElementById("waterTemperature");
    var phLevel = document.getElementById("phLevel");
    var lightOverlay = document.getElementById("lightOverlay");

    if (data.water_temp < 100) {
      water_temp = `${data.water_temp.toFixed(1)}C`;
      waterTemperature.innerHTML = water_temp;
    }

    fishAmount.innerHTML = fishCount;
    phlevel = `${ph_table[Math.floor(data.ph)]}`;
    phLevel.innerHTML = phlevel;
    lux = `${1 - (data.lux / 100000).toFixed(2) * 3}`;
    lightOverlay.style.opacity = lux;
  } catch (e) {
    console.log(e);
  }
});

let fishes = [];

function spawnFish() {
  for (; fishes.length < fishCount; ) {
    createFish();
  }
  animateFish();
  setInterval(function() {
    animateFish();
  }, 10000);
}

function createFish(fishType = "catFish") {
  var fishContainer = document.querySelector(".water");
  var fish = document.createElement("div");
  fish.classList.add(fishType);
  fish.dataset.oldX = 0;
  fishes.push(fish);
  fishContainer.appendChild(fish);
  return fish;
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
}

spawnFish();

socket.on("crop data", function(data) {
  for (key in rows) {
    for (let i = 0; i < calcAmount(data.plants[key], 10); i++) {
      let extraDiv = document.createElement("div");
      extraDiv = rows[key].html.cloneNode(true);
      rows[key].container.appendChild(extraDiv.querySelector("div"));
      rows[key].lastHarvested = data.plants[key].lastHarvested;
      rows[key].lastYield = (
        Math.floor(data.plants[key].yield.lastBatch) *
        data.plants[key].weightInKg
      ).toFixed(2);
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
    if (document.getElementById(key)) {
      document.getElementById(key).innerHTML = rows[key].temporaryData;
      document.getElementById(`${key}Harvest`).innerHTML =
        rows[key].lastHarvested;
      document.getElementById(`${key}Yield`).innerHTML = rows[key].lastYield;
    }
  }
  console.log(document.getElementById("fish-water"));
  if (document.getElementById("fish-water")) {
    console.log("wtf?");
    for (let i = 0; i < fishCount; i++) {
      console.log(fishes[i]);
      document.getElementById("fish-water").appendChild(fishes[i]);
    }
  }

  try {
    if (document.getElementById("fishAmount")) {
      var fishAmount = document.getElementById("fishAmount");
      var waterTemperature = document.getElementById("waterTemperature");
      var phLevel = document.getElementById("phLevel");
      var lightOverlay = document.getElementById("lightOverlay");
    }

    waterTemperature.innerHTML = water_temp;
    fishAmount.innerHTML = fishCount;
    phLevel.innerHTML = ph_table[6];
    lightOverlay.style.opacity = 0.5;
  } catch (e) {
    console.log(e);
  }
});
