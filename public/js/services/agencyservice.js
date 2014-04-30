'use strict';

app.factory('agencyService', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/v1/agency', {cache: true});
		}
	}
}]);