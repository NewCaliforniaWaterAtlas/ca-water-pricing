'use strict';

// app.factory('placeService', ['$document', '$window', '$q', '$rootScope', function ($document, $window, $q, $rootScope) {
  
//   var deferred = $q.defer();
  
//   if(typeof $window.google !== 'undefined' && typeof $window.google.maps !== 'undefined') {
//     console.log('yes, google is undefined, creating promise');
//     // Early-resolve the promise for googleMaps
//     deferred.resolve($window.google.maps);
//     return deferred.promise;
//   }
  
//   var randomizedFunctionName = 'onGoogleMapsReady' + Math.round(Math.random()*1000);
  
//   $window[randomizedFunctionName] = function() {
//     $window[randomizedFunctionName] = null;
//     // Resolve the promise for googleMaps
//     deferred.resolve($window.google.maps);
//   };
  
//   var script = $document[0].createElement('script');
//   script.type = 'text/javascript';
//   script.src = 'https://maps.googleapis.com/maps/api/js?v=3.14&sensor=false&callback='+randomizedFunctionName;
//   $document[0].body.appendChild(script);
//   // Return a promise for googleMaps
//   return deferred.promise;

// }]);


app.factory('placeService', ['$localStorage', '$timeout', '$document', '$window', '$q', '$rootScope', function ($localStorage, $timeout, $document, $window, $q, $rootScope) {
  

  var d = $q.defer();
  
  if(typeof $window.google !== 'undefined' && typeof $window.google.maps !== 'undefined') {
    console.log('yes, google is undefined, creating promise');
    // Early-resolve the promise for googleMaps
    d.resolve($window.google.maps);
    return d.promise;
  }
  
  var randomizedFunctionName = 'onGoogleMapsReady' + Math.round(Math.random()*1000);
  
  $window[randomizedFunctionName] = function() {
    $window[randomizedFunctionName] = null;
    // Resolve the promise for googleMaps
    d.resolve($window.google.maps);
  };
  
  var script = $document[0].createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.14&sensor=false&callback='+randomizedFunctionName;
  $document[0].body.appendChild(script);
  // Return a promise for googleMaps
  // return d.promise;




  var locations = $localStorage.locations ? JSON.parse($localStorage.locations) : {};
 
  var queue = [];
 
  // Amount of time (in milliseconds) to pause between each trip to the
  // Geocoding API, which places limits on frequency.
  var queryPause = 250;
 
  /**
   * executeNext() - execute the next function in the queue. 
   *                  If a result is returned, fulfill the promise.
   *                  If we get an error, reject the promise (with message).
   *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
   */
  var executeNext = function () {
    var task = queue[0],
    geocoder = new google.maps.Geocoder();
     
    geocoder.geocode({'latLng': task.latlng}, function (result, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        var geoaddress = {
          address: result[1].formatted_address
        };
     
        queue.shift();
     
        locations[task.latlng] = geoaddress;
        $localStorage.locations = JSON.stringify(geoaddress);
     
        task.d.resolve(geoaddress);
     
        if (queue.length) {
          $timeout(executeNext, queryPause);
        }
      
      } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          queue.shift();
          task.d.reject({
            type: 'zero',
            message: 'Zero results for geocoding latlng ' + task.latlng
          });
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            queryPause += 250;
            $timeout(executeNext, queryPause);
          } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
              queue.shift();
              task.d.reject({
                type: 'denied',
                message: 'Request denied for geocoding latlng ' + task.latlng
              });
            } else if (status === google.maps.GeocoderStatus.INVALID_REQUEST) {
                queue.shift();
                task.d.reject({
                  type: 'invalid',
                  message: 'Invalid request for geocoding latlng' + task.latlng
                });
              }
    }); // end geocoder
  }; // end executeNext

  return {
    addressForLatLng : function (lat, lng) {
      var d = $q.defer();
      var lat = parseFloat(lat);
      var lng = parseFloat(lng);
      var latlng = new google.maps.LatLng(lat, lng);
      if (latlng in locations) {
        $timeout(function () {
          d.resolve(locations[latlng]);
        });
      } else {
          queue.push({
            latlng: latlng,
            d: d
          });
          if (queue.length === 1) {
            executeNext();
          }
        }
        
        return d.promise;
    }
  };


}]);