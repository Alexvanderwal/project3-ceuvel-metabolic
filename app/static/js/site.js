var socket = io();

socket.on("amqp data", function(data) {
  try {
    var water_temperature = document.getElementById("water_temperature");
    var ph_level = document.getElementById("ph_level");
    if (data.water_temp < 100) {
      water_temperature.innerHTML = data.water_temp;
    }
    ph_level.innerHTML = data.ph;
  } catch (e) {
    console.log(e);
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
