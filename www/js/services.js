angular.module('starter.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(firebaseUrl);
            return $firebaseAuth(ref);
	}])

.factory('UserService', function($firebaseArray, $firebaseObject, $firebaseAuth, $q){

	var ref = new Firebase(firebaseUrl);

 
  return {
    getUsers: function(){ 
      return $firebaseArray(ref.child('users'));
    },
    getUser: function(){
      console.log("getting the new user");
      var authUID = $firebaseAuth(ref).$getAuth().uid;

      return $firebaseObject(ref.child('users').child(authUID));
    },
    getUserInfo: function(){
      var value = 0;
      var deferred = $q.defer();
      var authUID = $firebaseAuth(ref).$getAuth().uid;
      ref.child('users').child(authUID).on("value", function(snapshot) {
        value = snapshot.val();
      });
      deferred.resolve(value);
      return deferred.promise;
    }
  }  
})
