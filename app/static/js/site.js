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

socket.on("crop data", function(data) {
  let lettuceRow = document.getElementById("lettuce");
  if (lettuceRow.children.length < 1) {
    for (let i = 0; i < calcAmount(data.plants.lettuce, 10); i++) {
      let extraDiv = document.createElement("div");
      console.log(dummyDivLettuce);
      extraDiv.innerHTML = dummyDivLettuce;
      console.log(extraDiv.innerHTML);
      lettuceRow.appendChild(extraDiv);
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
Barba.transitionLength = 1000;
Barba.Pjax.start();
