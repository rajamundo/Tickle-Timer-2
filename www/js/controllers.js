angular.module('starter.controllers', ['ngCordova', 'starter.services'])

.controller('LoginCtrl', function($scope, $state, $ionicModal, $rootScope,$firebaseAuth, $ionicLoading, $ionicHistory) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var ref = new Firebase($scope.firebaseUrl);
  var auth = $firebaseAuth(ref);

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname,
                    userPts: 0,
                    record: 0, //time value stored in seconds
                    ranking: "Tickle Tease",
                    currentGoal: 0
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
           console.log("else"); //alert("Please fill all details");
    }
  $scope.signIn = function (user) {

  if (user && user.email && user.pwdForLogin) {
      // $ionicLoading.show({
      //     template: 'Signing In...'
      // });
      auth.$authWithPassword({
          email: user.email,
          password: user.pwdForLogin
      }).then(function (authData) {
          console.log("Logged in as:" + authData.uid);
          ref.child("users").child(authData.uid).once('value', function (snapshot) {
              var val = snapshot.val();
              // To Update AngularJS $scope either use $apply or $timeout
              // $scope.$apply(function () {
              //     $rootScope.displayName = val;
              // });
          });
          //$ionicLoading.hide();
          $state.go('app.account');
      }).catch(function (error) {
          //alert("Authentication failed:" + error.message);
          $ionicLoading.hide();
      });
  } else
      console.log("else");//alert("Please enter email and password both");
}
})

.controller('AccountCtrl', function($scope, $firebaseAuth, UserService, $state, $ionicHistory, $firebaseObject) {

  $scope.getAccountInfo = function() {

    var user = UserService.getUser();
   //  var reff = new Firebase(firebaseUrl);
   // var authUID = $firebaseAuth(reff).$getAuth().uid;
   //  var user = $firebaseObject(reff.child('users').child(authUID));
    user.$ref().on("value", function(snapshot) {
    $scope.values = snapshot.val()
    console.log($scope.values);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  };
  console.log("in account");

  $scope.doRefresh = function() {
    $http.get('/account')
     .success(function() {
       
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  //user.$bindTo($scope, "userdata");
  //user.$ref().set({ userPts : 4 });

  //console.log(authData.score);

})


.controller('AchievementsCtrl', function($scope, UserService) {
  var user = UserService.getUser();
  user.$ref().on("value", function(snapshot) {
    userInfo= snapshot.val();
    $scope.userInfo = userInfo;

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

})


// timer functionality below using the scope variables "seconds" and "minutes"

.controller('StopWatchCtrl', function($scope, $interval, UserService){
  var user = UserService.getUser();
  user.$ref().on("value", function(snapshot) {
    userInfo= snapshot.val();
    $scope.goal = userInfo.currentGoal;
    console.log(userInfo);
    console.log($scope.goal);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  // $scope.startTimer = function() {
  //   $scope.seconds = 0;
  //   $scope.minutes = 0;
  //   $scope.milli = 0;

  //   timer = $interval(function() {
  //     $scope.milli += 10;
  //     if($scope.milli >= 1000) {
  //       $scope.seconds += 1;
  //       $scope.milli = 0;
  //     }
  //     if($scope.seconds >= 60) {
  //       $scope.seconds = 0;
  //       $scope.minutes += 1;
  //     }
  //   }, 10);

  // };

  // $scope.stopTimer = function() {
  //   $interval.cancel(timer);
  // };

  // $scope.clearTimer = function() {
  //   $scope.seconds = 0;
  //   $scope.minutes = 0;
  //   $scope.milli = 0;
  // };

  var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null
    , pressed = false;

$scope.startTimer = function(){
    if(pressed === false){
      pressed = true;
      if (timeBegan === null) {
          timeBegan = new Date();
      }

      if (timeStopped !== null) {
          stoppedDuration += (new Date() - timeStopped);
      }
      console.log(stoppedDuration);

      started = $interval(clockRunning, 10);  
  }
};

$scope.stopTimer = function() {
    timeStopped = new Date();
    $interval.cancel(started);
    pressed = false;
};
 
$scope.clearTimer = function(){
    $interval.cancel(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    $scope.min = 0;
    $scope.sec = 0
    $scope.ms = 0;
    $scope.curRecord = 0;
    pressed = false;
};

clockRunning = function(){
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - timeBegan - stoppedDuration);
        $scope.min = timeElapsed.getUTCMinutes();
        $scope.sec = timeElapsed.getUTCSeconds();
        $scope.ms = timeElapsed.getUTCMilliseconds();

       $scope.min = ($scope.min > 9 ? $scope.min : "0" + $scope.min);
       $scope.sec = ($scope.sec > 9 ? $scope.sec : "0" + $scope.sec);
       $scope.ms = ($scope.ms > 99 ? $scope.ms : $scope.ms > 9 ? "0" + $scope.ms : "00" + $scope.ms);
       $scope.curRecord = Number($scope.min)*60 + Number($scope.sec) + Number($scope.ms/1000);
};


$scope.submitScore = function(){
  newRecord = Number($scope.min)*60 + Number($scope.sec) + Number($scope.ms/1000);
  console.log(userInfo.record);
  console.log(newRecord);
  if(newRecord > userInfo.record) {
    addedValue = 0;
    if (newRecord > 10) addedValue = 10;
    else addedValue = Number($scope.sec);
    newGoal = newRecord + addedValue;
    user.$ref().update({
      "record" : newRecord,
      "currentGoal" : newGoal
    });
  }
  $scope.clearTimer();
};


});
