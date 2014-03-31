'use strict';

app.factory('placeService', ['$document', '$window', '$q', '$rootScope', function ($document, $window, $q, $rootScope) {
    
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
  script.src = 'http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&callback='+randomizedFunctionName;
  $document[0].body.appendChild(script);
  // Return a promise for googleMaps
  return d.promise;



}]);


