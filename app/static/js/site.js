// let HideShowTransition = Barba.BaseTransition.extend({
//   start: function() {
//     this.newContainerLoading.then(this.finish.bind(this));
//     console.log("works");
//   },

//   finish: function() {
//     document.body.scrollTop = 0;
//     this.done();
//   }
// });

// Barba.Pjax.getTransition = function() {
//   return HideShowTransition;
// };

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
  //   let hexagonSvg = href.childNodes[1];
  //   //   hexagonSvg.setAttribute("data-transition", "scaleUp");
  //   href.setAttribute("data-transition", "scaleUp");
  //   console.log(hexagonSvg);
  //   hexagonSvg.querySelector(".svgText").style.opacity = 0;

  //   href.classList.toggle("scalingSvg");
  //   //   hexagonSvg.classList.toggle("scalingSvg");

  //   console.log(hexagonSvg.classList);
  //   console.log(href.childNodes[1]);
}
Barba.transitionLength = 1000;
Barba.Pjax.start();
