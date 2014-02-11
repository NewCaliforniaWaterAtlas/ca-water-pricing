'use strict';

app.controller('modalController', function modalController ($scope, $modalInstance, billService) {
  
  // $scope.items = items;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };
  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  //   console.log('ok');
  // };

  $scope.createBill = function() {

    // validate the formData to make sure that something is there
    // if form is empty, nothing will happen
    

      // call the create function from our service (returns a promise object)
      billService.create($scope.formData)

        // if successful creation, call our get function to get all the new records
        .success(function(data) {
          $scope.formData = {}; // clear the form so our user is ready to enter another
          $scope.records = data; // assign our new list of records
          $scope.data = data;
          $scope.points = data;
          $modalInstance.close();
          console.log('ok');
        });
    
  };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    console.log('cancel');
  };
});