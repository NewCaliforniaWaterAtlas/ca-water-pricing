app.factory('mapService', ['$document', '$window', '$q', '$rootScope',
  
  function($document, $window, $q, $rootScope) {
    
    var d = $q.defer(),
    
    mapservice = {
      map: function() { return d.promise; }
    };
    
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { 
        d.resolve($window.map);
      });
  }
    
  var scriptTag = $document[0].createElement('script');
  scriptTag.type = 'text/javascript'; 
  scriptTag.async = true;
  scriptTag.src = 'http://api.tiles.mapbox.com/mapbox.js/v1.6.1/mapbox.js';

  scriptTag.onreadystatechange = function () {
    if (this.readyState == 'complete') onScriptLoad();
  }
  
  scriptTag.onload = onScriptLoad;

  var s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);
 
  return mapservice;

}]);