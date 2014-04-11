'use strict';

app.directive('clickBanner', ['$window', function ($window) {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {

      var timeoutID;

      function svgLoad() {
        timeoutID = $window.setTimeout(getSVG, 1000);
      }

      function getSVG() {
        var circleMarkers = document.getElementsByClassName("leaflet-clickable");
        // var cmArray = [].slice.call(circleMarkers);
        // console.log(cmArray);
        for(var i = 0; i < circleMarkers.length; i++) {
          var g = circleMarkers[i];

          g.onclick = function () {
            element.parent().addClass('hide');
            // console.log("clicked");
            return false;
          };
        }
      }
      svgLoad();
    },
    template: '<img id="clickbanner" src="img/assets/click_banner.png" alt="" />'
  };
}]);