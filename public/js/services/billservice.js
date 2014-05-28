'use strict';

app.factory('billService', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/v1/bills');
		},
		create : function(billData) {
			return $http.post('/api/v1/bills', billData);
		}
		// delete : function(id) {
		// 	return $http.delete('/api/v1/bills/' + id);
		// }
	}
}]);