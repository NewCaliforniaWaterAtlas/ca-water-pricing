'use strict';

app.factory('palmerFeature', ['$http', function ($http) {
	return {
		get : function() {
			return $http.get('/v1/api/features/palmerdrought');
		}
	}
}]);

app.factory('featureCache', ['$cacheFactory', function ($cacheFactory) {
	return $cacheFactory('palmerdata');
}]);