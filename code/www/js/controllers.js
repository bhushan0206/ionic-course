angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
	// helper function for loading
	var showLoading = function() {
		$ionicLoading.show({
			template: '<i class="ion-loading-c"></i>',
			noBackdrop: true
		});
	}

	var hideLoading = function() {
		$ionicLoading.hide();
	}

	// set loading to true first time while we retrive songs from server
	showLoading();

	//get our first songs
	Recommendations.init()
		.then(function() {
			$scope.currentSong = Recommendations.queue[0];
			Recommendations.playCurrentSong();		
		})
		.then(function() {
			// turn loading off
			hideLoading();
			$scope.currentSong.loaded = true;
		});

	$scope.songs = [];

	$scope.currentSong = angular.copy($scope.songs[0]);

	//fired when we favorite / skip a song
	$scope.sendFeedback = function(bool) {
		//first, add to favorites if they favoriated
		if (bool) User.addSongToFavorites($scope.currentSong);

		//set variables for the correct animation sequence
		$scope.currentSong.rated = bool;
		$scope.currentSong.hide = true;		

		//prepare the next song
		Recommendations.nextSong();

		$timeout(function (){
			//timeout to allow animation to complete
			$scope.currentSong = Recommendations.queue[0];
			$scope.currentSong.loaded = true;
		}, 250);

		Recommendations.playCurrentSong().then(function() {
			$scope.currentSong.loaded = false;
		});
		
	}

	// used for retrieving the next album image
	// if there isnt an album available next, return empty string
	$scope.nextAlbumTag = function() {
		if (Recommendations.queue.length > 1) {
			return Recommendations.queue[1].image_large;
		}

		return '';
	}

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User) {
	// get the list of our favorites from the User service
	$scope.favorites = User.favorites;

	$scope.removeSong = function(song, index) {
		User.removeSongFromFavorites(song, index);
	}

	$scope.openSong = function(song) {
		$window.open(song.open_url, "_system");
	}

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
	// expose the number of new favorites to the scope
	$scope.favCount = User.favoriteCount;

	// stop audio when going to favorites tab
	$scope.enteringFavorites = function() {
		User.newFavorites = 0;
		Recommendations.haltAudio();
	}

	$scope.leavingFavorites = function() {
		Recommendations.init();
	}

})

.controller('SplashCtrl', function($scope, $state, User){

	// attempt to signup/login via User.auth
	$scope.submitForn = function(username , signingUp) {
		User.auth(username, signingUp).then(function() {
			// session is now set, so lets redirect to discover page
			$state.go('tab.discover');
		}, function() {
			// error handling here
			alert('Hmm...try another username');
		});
	}
	
});