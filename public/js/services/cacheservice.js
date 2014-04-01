'use strict';

app.factory('featureCache', ['$cacheFactory', function ($cacheFactory) {
	return $cacheFactory('palmerdata');
}]);