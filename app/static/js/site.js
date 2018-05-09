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

function navigate(event) {
  console.log(event.target);
}

Barba.Pjax.start();
