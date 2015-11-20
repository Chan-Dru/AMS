angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,LocalFactory,$window) {
    if($window.localStorage.getItem("faculty_subject")!=null){
      $scope.subjects = LocalFactory.getarray($window.localStorage.getItem("faculty_subject"));
    }
})

.controller('DashDetailCtrl',function($scope,$stateParams,LocalFactory,$window,Student,LocalDb,$state){
   $scope.subject = $stateParams.subject;
   var studentsName = LocalFactory.getarray($window.localStorage.getItem($scope.subject.substring(0,3)));
   $scope.students = LocalFactory.setstudentlist(studentsName);
   $scope.localsave = function(){
    LocalFactory.savelocal($scope.students,$scope.subject);
    $scope.subjects = LocalDb.all();
    $state.go('tab.chats');
   }
})

.controller('ChatsCtrl', function($scope,LocalDb,Student){
  $scope.subjects = LocalDb.all();
  LocalDb.set1();
  $scope.tab = function(subject){
    Student.setSubject(subject);
 }
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

.controller('AccountCtrl', function($scope,$cordovaSQLite,$ionicPlatform,$http,$state) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.logout = function(){
      $http.post('http://localhost:2403/faculty/logout');
      $state.go('login');
      
  };
  $ionicPlatform.ready(function() {

  $scope.delete = function(){

    var query = "SELECT name FROM sqlite_master WHERE type = 'table'";
    $cordovaSQLite.execute(db,query,null).then(function(res){
      for(var i=1;i<res.rows.length;i++){
        console.log(res.rows[i].name);
        var query = "DROP TABLE "+res.rows[i].name;
        $cordovaSQLite.execute(db,query);
      }
    }, function (err){
        console.error(err);
    });
  };
    $scope.insert = function(firstname, lastname) {
      console.log("in insert");
      $scope.f = firstname;
      $scope.l = lastname;
        var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
        }, function (err) {
            console.error(err);
        });
    };
 
    $scope.select = function(lastname) {
        //var query = "SELECT id, firstname, lastname FROM people WHERE lastname = ?";
        //var query = "SELECT sql FROM sqlite_master WHERE tbl_name='push' AND type = 'table'"; // list columns
        var query = "SELECT name FROM sqlite_master WHERE type = 'table'";
        //var query = "SELECT * FROM push";
        var obj = [];
        // $cordovaSQLite.execute(db, query, null).then(function(res) {
        //     if(res.rows.length > 0) {
        //       for(var i=1; i<res.rows.length; i++){
        //         obj.push(res.rows.item(i));
        //       //  console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
        //       }
        //       $scope.f = obj.length;
        //     } else {
        //       $scope.r = "none";
        //         console.log("No results found");
        //     }
        // }, function (err) {
        //     console.error(err);
        // });
        
      }
    });
})

.controller('LoginCtrl',function($scope,$state,LoginFactory,InitialFactory){
  $scope.data={};
  var result = {};
  $scope.data.username = "chan";
  $scope.data.password = "chan";
  $scope.login = function() {
    LoginFactory.loginUser($scope.data.username, $scope.data.password).success(function(data) {
        if(data != false){
          console.log(data);
          InitialFactory.initial(data).success(function (init){
            $scope.data={};
            $state.go('tab.dash');
            console.log(init); 
          }).error(function(init){
            console.log(init);
          });
          
        }else{
          $scope.data={};
          $state.go('tab.dash');
        }
        
    }).error(function(data) {
        $scope.data.err="Please check your credentials";
    });
   // InitialFactory.initial();
  }  
});
