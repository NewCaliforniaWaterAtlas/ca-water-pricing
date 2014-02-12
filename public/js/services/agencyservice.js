'use strict';

app.factory('agencyService', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/v1/api/agency');
		}
	}
}]);