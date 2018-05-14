var socket = io();
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
  let herbsRow = document.getElementById("herbs");
  let rows = {
    lettuce: {
      container: document.getElementById("lettuce"),
      html: dummyDivLettuce
    },
    herbs: {
      container: document.getElementById("herbs"),
      html: dummyDivLettuce
    }
  };

  for (key in rows) {
    for (let i = 0; i < calcAmount(data.plants[key], 10); i++) {
      let extraDiv = document.createElement("div");
      extraDiv.innerHTML = rows[key].html;
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
var temporaryData;
Barba.Pjax.start();
Barba.Dispatcher.on("newPageReady", function(
  currentStatus,
  oldStatus,
  container
) {
  console.log("test");
  temporaryData = document.getElementById("lettuce").innerHTML;
});
Barba.Dispatcher.on("transitionCompleted", function(currentStatus) {
  document.getElementById("lettuce").innerHTML = temporaryData;
});
