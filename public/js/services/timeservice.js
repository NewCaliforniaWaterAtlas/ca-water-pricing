'use strict';

app.factory('timeService', ['$document', '$window', '$q', '$rootScope',
  
  function($document, $window, $q, $rootScope) {
    
    var d = $q.defer(),
    
    timeservice = {
      time: function() { return d.promise; }
    };
    
    function onScriptLoad() {
      // Load client in the browser
      $rootScope.$apply(function() { 
        d.resolve($window.time);
      });
  }
    
  var scriptTag = $document[0].createElement('script');
  scriptTag.type = 'text/javascript'; 
  scriptTag.async = true;
  scriptTag.src = '../../components/momentjs/moment.js';
 
  scriptTag.onreadystatechange = function () {
    if (this.readyState == 'complete') onScriptLoad();
  }
  
  scriptTag.onload = onScriptLoad;

  var s = $document[0].getElementsByTagName('body')[0];
  s.appendChild(scriptTag);
 
  return timeservice;

}]);

