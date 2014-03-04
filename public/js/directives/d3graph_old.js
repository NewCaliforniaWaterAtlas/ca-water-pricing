'use strict';

app.directive('d3Graph', ['d3Service', '$window', function (d3Service, $window) {
  return {
    restrict: 'A',
    scope: {
      data: '=', // bi-directional data-binding
      onClick: '&'  // parent execution binding
    },
    link: function(scope, element, attrs) {

      d3Service.d3().then(function(d3) {
        
        var margin = {top: 20, right: 20, bottom: 20, left: 20};

        // default width/height - mainly to create initial aspect ratio
        var width = scope.width || 600;
        var height = scope.height || 300;

        var svg = d3.select(element[0]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function (newVals, oldVals) {
          return scope.render(newVals);
        }, true);

        scope.render = function(data) {
          
          // remove all previous items before render
          svg.selectAll("*").remove();

          if (data) {

            var x = d3.scale.linear()
              .range([0, width]);

            var y = d3.scale.linear()
              .range([height, 0]);

            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

            x.domain([0, d3.max(data, function(d) { return d.hsize; })*2]);
            y.domain(data.map(function(d) { return d.bill; }));

            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Total Bill");

            svg.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.hsize); })
              .attr("width", function(d) { return width - x(d.hsize); })
              .attr("y", function(d) { return y(d.bill); })
              .attr("height", function(d) { return height - y(d.bill); });

          }
        }
      });

    }//end link method
  };//end return

}]);

