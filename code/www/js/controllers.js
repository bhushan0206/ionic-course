angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
	//get our first songs
	Recommendations.getNextSongs()
		.then(function() {
			$scope.currentSong = Recommendations.queue[0];
		})

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
		}, 250);
		
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
.controller('FavoritesCtrl', function($scope, User) {
	// get the list of our favorites from the User service
	$scope.favorites = User.favorites;

	$scope.removeSong = function(song, index) {
		User.removeSongFromFavorites(song, index);
	}

})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope) {

});