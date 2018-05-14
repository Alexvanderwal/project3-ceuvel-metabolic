var socket = io();
var ph_table = {
  0: 'Battery Acid (0)',
  1: 'Stomach Acid (1)',
  2: 'Lemon Juice (2)',
  3: 'Orange Juice (3)',
  4: 'Tomato Juice (4)',
  5: 'Black Coffee (5)',
  6: 'Cow Milk (6)',
  7: '"Pure" Water (7)',
  8: 'Seawater (8)',
  9: 'Toothpaste (9)',
  10: 'Brocoli (10)',
  11: 'Household Ammonia (11)',
  12: 'Soapy Water (12)',
}

socket.on("amqp data", function(data) {
  try {
    var fishAmount = document.getElementById("fishAmount");
    var waterTemperature = document.getElementById("waterTemperature");
    var phLevel = document.getElementById("phLevel");
    var lightOverlay = document.getElementById("lightOverlay")

    if (data.water_temp < 100) {
      waterTemperature.innerHTML = `${data.water_temp.toFixed(1)}C`;
    }

    fishAmount.innerHTML = 8;

    phLevel.innerHTML = ph_table[Math.floor(data.ph)];
    lightOverlay.style.opacity = 1 - ((data.lux / 100000).toFixed(2) * 3);
  } catch (e) {
    console.log(e);
  }
});

function createFish() {
  var fishContainer = document.querySelector('.water');
  var fish = document.createElement('div');
  fish.classList.add('catFish');
  fish.dataset.oldX = 0;
  fishContainer.appendChild(fish);
  animateFish();
}

function animateFish() {
  var containerHeight = document.querySelector('.water').offsetHeight;
  var containerWidth = document.querySelector('.water').offsetWidth;
  document.querySelectorAll('.catFish').forEach((fish) => {
    var oldX = fish.dataset.oldX;
    var newX = Math.floor((Math.random() * (containerWidth - 100)) + 1)
    var newY = Math.floor((Math.random() * (containerHeight - 35)) + 1)
    if (oldX < newX) {
      fish.style.transform = 'rotateY(180deg)';
      fish.style.top = `${newY}px`;
      fish.style.left = `${newX}px`;
    } else {
      fish.style.transform = 'rotateY(0)';
      fish.style.top = `${newY}px`;
      fish.style.left = `${newX}px`;
    }
    fish.dataset.oldX = newX;
  })
  setInterval(function(){
    animateFish();
  }, 10000);
}

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
Barba.transitionLength = 1000;
Barba.Pjax.start();

for (let i = 0; i < 8; i++) {
  createFish();
}

window.setInterval(function(){
  socket.emit('heartbeat', {
    msg: 'I am NOT dead!',
});
}, 5000);