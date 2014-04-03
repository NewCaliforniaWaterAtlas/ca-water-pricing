'use strict';

app.filter('mainSearch', [ function (){
	return function (input) {
		if (input) {
			return input;
		}
		
	}
}])