'use strict';

// app.factory('googleService', ['$document', '$window', '$q', '$rootScope',
  
//   function($document, $window, $q, $rootScope) {
    
//     var d = $q.defer(),
    
//     googleservice = {
//       map: function() { return d.promise; }
//     };
    
//     function onScriptLoad() {
//       // Load client in the browser
//       $rootScope.$apply(function() { 
//         d.resolve($window.map);
//       });
//   }
   
//   var scriptTag = $document[0].createElement('script'); 
//   scriptTag.type = 'text/javascript'; 
//   scriptTag.async = true;
//   scriptTag.src = 'http://maps.google.com/maps/api/js?v=3&sensor=false';
   
//   scriptTag.onreadystatechange = function () {
//     if (this.readyState == 'complete') onScriptLoad();
//   }
  
//   scriptTag.onload = onScriptLoad;

//   var s = $document[0].getElementsByTagName('body')[0];
//   s.appendChild(scriptTag);
 
//   return googleservice;

// }]);




app.factory('googleService', ['$document', '$window', '$q', '$rootScope', function ($document, $window, $q, $rootScope) {
    
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
  script.src = 'http://maps.google.com/maps/api/js?v=3&sensor=false&callback='+randomizedFunctionName;
  $document[0].body.appendChild(script);
  // Return a promise for googleMaps
  return d.promise;



}]);