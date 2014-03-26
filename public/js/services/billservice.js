'use strict';

app.factory('billService', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/v1/api/bills', {cache: true});
		},
		create : function(billData) {
			return $http.post('/v1/api/bills', billData);
		},
		delete : function(id) {
			return $http.delete('/v1/api/bills/' + id);
		}
	}
}]);