'use strict';

app.directive('d3Graph', ['d3Service', '$window', '$compile', function (d3Service, $window, $compile) {
  return {
    restrict: 'A',
    scope: {
      data: '=', // bi-directional data-binding
      onClick: '&'  // parent execution binding
    },
    link: function(scope, element, attrs) {

      d3Service.d3().then(function(d3) {
        
        var margin = {t:30, r:20, b:20, l:40 },
          w = 500 - margin.l - margin.r,
          h = 300 - margin.t - margin.b,
          x = d3.scale.linear().range([0, w]),
          y = d3.scale.linear().range([h - 60, 0]),
  
          color = d3.scale.category10();

        var svg = d3.select(element[0]).append("svg")
          .attr("width", w + margin.l + margin.r)
          .attr("height", h + margin.t + margin.b);

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

            // set axes, as well as details on their ticks
            var xAxis = d3.svg.axis()
              .scale(x)
              .ticks(10)
              .tickSubdivide(true)
              .tickSize(6, 3, 0)
              .orient("bottom");

            var yAxis = d3.svg.axis()
              .scale(y)
              .ticks(10)
              .tickSubdivide(true)
              .tickSize(6, 3, 0)
              .orient("left");

            // group that will contain all of the plots
            var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");

            x.domain([0, 500]);
            y.domain([0, 12]);

            // style the circles, set their locations based on data
            var circles =
            groups.selectAll("circle")
              .data(data)
              .enter().append("circle")
              .attr("class", "circles")
              .attr({
                cx: function(d) { return x(+d.bill); },
                cy: function(d) { return y(+d.hsize); },
                r: function(d) { return d.pday; }
              })
              .attr("tooltip-append-to-body", true)
              .attr("tooltip", function(d){
                return d.city + ": $" + d.pday + " /day";
              })

              .style("fill", function(d) { 
                if (d.billtype == "mrate") {
                  return "#9abab4";
                } else {
                  return "#a4ad50";
                }
              });

            // what to do when we mouse over a bubble
            var mouseOn = function() { 
              var circle = d3.select(this);
              // transition to increase size/opacity of bubble

              circle.transition()
              .duration(800).style("opacity", 1)
              .attr("r", 16).ease("elastic");

              // append lines to bubbles that will be used to show the precise data points.
              // translate their location based on margins
              svg.append("g")
                .attr("class", "guide")
              .append("line")
                .attr("x1", circle.attr("cx"))
                .attr("x2", circle.attr("cx"))
                .attr("y1", +circle.attr("cy") + 26)
                .attr("y2", h - margin.t - margin.b)
                .attr("transform", "translate(40,20)")
                .style("stroke", circle.style("fill"))
                .transition().delay(200).duration(400).styleTween("opacity", function() { return d3.interpolate(0, .5); });

              svg.append("g")
                .attr("class", "guide")
              .append("line")
                .attr("x1", +circle.attr("cx") - 16)
                .attr("x2", 0)
                .attr("y1", circle.attr("cy"))
                .attr("y2", circle.attr("cy"))
                .attr("transform", "translate(40,30)")
                .style("stroke", circle.style("fill"))
                .transition().delay(200).duration(400).styleTween("opacity", function() { return d3.interpolate(0, .5); });

              // function to move mouseover item to front of SVG stage, in case
              // another bubble overlaps it
              d3.selection.prototype.moveToFront = function() { 
                return this.each(function() { 
                this.parentNode.appendChild(this); 
                }); 
              };

            };
            // what happens when we leave a bubble?
            var mouseOff = function() {
              var circle = d3.select(this);

              // go back to original size and opacity
              circle.transition()
              .duration(800).style("opacity", .5)
              .attr("r", function(d) { return d.pday; }).ease("elastic");

              // fade out guide lines, then remove them
              d3.selectAll(".guide").transition().duration(100).styleTween("opacity", 
                function() { return d3.interpolate(.5, 0); })
                .remove()
            };

            // run the mouseon/out functions
            circles.on("mouseover", mouseOn);
            circles.on("mouseout", mouseOff);

            // draw axes and axis labels
            svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(" + margin.l + "," + (h - 60 + margin.t) + ")")
              .call(xAxis);

            svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(" + margin.l + "," + margin.t + ")")
              .call(yAxis);

            svg.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .attr("x", w + 50)
              .attr("y", h - margin.t - 5)
              .text("Total Water Bill (USD)");

            svg.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .attr("x", -20)
              .attr("y", 45)
              .attr("dy", ".75em")
              .attr("transform", "rotate(-90)")
              .text("Household Size");


            element.removeAttr("d3-graph");
            $compile(element)(scope);

          } // end if data
        } // end scope.render
      }); // end 3Service.d3()

    }//end link method
  };//end return

}]);

