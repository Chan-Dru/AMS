angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, LoginFactory) {
  $scope.subjects=[];
  $scope.subjects= LoginFactory.getList();
})

.controller('ChatsCtrl', function($scope,LocalDb,Student) {
  $scope.subjects = LocalDb.all();
  $scope.tab = function(subject){
    Student.setSubject(subject);
 }
})

.controller('DashDetailCtrl',function($scope,$stateParams,Student,LocalDb,$state){
  $scope.students = Student.getList($stateParams.subject);
  $scope.subjects = [];
  var sub = [];
  $scope.local = function(){
    LocalDb.set($scope.students,$stateParams.subject);
    $scope.subjects = LocalDb.all();
    $state.go('tab.chats');
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, LocalDb,Student,$state) {
 $scope.subject = Student.getSubject();
var actives = LocalDb.getStudent($stateParams.attendance,$scope.subject)
var newStudents = [];
 newStudents = Student.getList($scope.subject);
for(var i =0;i<newStudents.length;i++){
  newStudents[i].active = actives[i]; 
}
$scope.students = newStudents;
$scope.update = function(){
    LocalDb.update($scope.students,$scope.subject,$stateParams.attendance);
    $state.go('tab.chats');
 
}
})

.controller('AccountCtrl', function($scope,$state) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout = function(){
      $state.go('login');
  };
})

.controller('LoginCtrl',function($scope,$state,LoginFactory){
  $scope.data={};
  var result = {};
  $scope.login = function() {
        var active = LoginFactory.loginUser($scope.data.username,$scope.data.password);
            if(active == true){
              $scope.data={};
              $state.go('tab.dash');  
            }else{
              $scope.data.err="Please check your credentials";  
            }
    }
});
