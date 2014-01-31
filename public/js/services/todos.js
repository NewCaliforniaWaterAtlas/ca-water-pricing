angular.module('billService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Bills', function($http) {
		return {
			get : function() {
				return $http.get('/v1/api/prices');
			},
			create : function(billData) {
				return $http.post('/v1/api/prices', billData);
			},
			delete : function(id) {
				return $http.delete('/v1/api/prices/' + id);
			}
		}
	});