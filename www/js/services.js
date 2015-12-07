angular.module('starter.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(firebaseUrl);
            return $firebaseAuth(ref);
	}])

.factory('UserService', function($firebaseArray, $firebaseObject, $firebaseAuth){
 
  var ref = new Firebase(firebaseUrl);
  var authUID = $firebaseAuth(ref).$getAuth().uid;

  return {
    getUsers: function(){ 
      return $firebaseArray(ref.child('users'));
    },
    getUser: function(){
      return $firebaseObject(ref.child('users').child(authUID));
    }
  }  
})
