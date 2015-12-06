angular.module('starter.controllers', ['ngCordova', 'starter.services'])

.controller('LoginCtrl', function($scope, $state, $ionicModal, $rootScope,$firebaseAuth, $ionicLoading) {

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
                    userPts: 0
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }
  $scope.signIn = function (user) {

  if (user && user.email && user.pwdForLogin) {
      $ionicLoading.show({
          template: 'Signing In...'
      });
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
          $ionicLoading.hide();
          $state.go('app.playlists');
      }).catch(function (error) {
          alert("Authentication failed:" + error.message);
          $ionicLoading.hide();
      });
  } else
      alert("Please enter email and password both");
}
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
