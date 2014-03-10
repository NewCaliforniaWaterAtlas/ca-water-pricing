'use strict';

app.directive('d3Donut', ['d3Service', '$window', function (d3Service, $window) {
  return {
    restrict: 'E',
    scope: {
      data: '=', // bi-directional data-binding
    },
    link: function(scope, element, attrs) {

      d3Service.d3().then(function(d3) {
        
        // var frate = 0;
        // var mrate = 0;
        
        // // loop through scope.data
        // angular.forEach(scope.data, function(entry, key){
        //   // console.log(entry.billtype);
        //   if (entry.billtype === "frate"){
        //     frate++;
        //   }
        //   else if (entry.billtype === "mrate"){
        //     mrate++;
        //   }
        //   else {
        //     return;
        //   }
        // });

        var color = d3.scale.category10();
        var el = element[0];
        var width = 200;
        var height = 200;
        var min = Math.min(width, height);
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);
        var svg = d3.select(el).append('svg')
          .attr({width: width, height: height})
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        
        // add the <path>s for each arc slice
        svg.selectAll('path').data(pie(scope.data))
        // svg.selectAll('path').data(pie([frate,mrate]))
          .enter().append('path')
            .style('stroke', 'white')
            .attr('d', arc)
            .attr('fill', function(d, i){ return color(i) });
        
      }); //end then

    }//end link method
  };//end return

}]);

