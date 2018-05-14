var socket = io();
var ph_level = document.getElementById('ph_level')
var water_temperature = document.getElementById('water_temperature')


socket.on("amqp data", function(data) {
  ph_level.innerHTML = data.ph;
  water_temperature.innerHTML = data.water_temp
  console.log(data);
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
