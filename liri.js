
var keys = require('./keys.js');
var twitter  = require('twitter');
var spotify  = require('node-spotify-api');
var request  = require('request');
var inquirer = require('inquirer');
var fs = require('fs');


runoption();


function runoption() {

	inquirer.prompt([{
	    type: 'list',
	    name: 'option',
	    message: 'Chose activity?',
	    choices: [
			'my-tweets', 
			'spotify-this-song', 
			'movie-this', 
			'do-what-it-says'
			
	    ]
	  }
	])
	.then((answers) => {

		switch (answers.option) {

			case 'my-tweets':
				getMyTweets();
				break;
				// console.log('LIRI does m=not know this');

			case 'spotify-this-song':
				inquirer.prompt([{
				    type: 'input',
				    name: 'song',
				    message: 'About what song you want to learn?',
				  }
				])
				.then((answers) => {
					var song = answers.song;
					getMusicInfo(song);
					
				});
				break;

			case 'movie-this':
				inquirer.prompt([{
				    type: 'input',
				    name: 'movie',
				    message: 'What movie you want to know?'
				  }
				])
				.then((answers) => {
					var movie = answers.movie;
					getMovie(movie);
				});
				break;

				case 'do-what-it-says':
				doWhatitSays();
				break;
				 
							
				// console.log('\nThis option is currently not supported.\n');
				// logStuffThatHappens('do-what-it-says     ', 'not supported');
				// reRunoption();
				// break;
			
			default:
				nodeLogActivity('runoption()      ', 'default Switch/Case');
				console.log("something is wrong, try again...\n")
		}
	})
}


function reRunoption() {
	inquirer.prompt([{
	    type: 'confirm',
	    name: 'confirm',
	    message: 'restart the option?',
	  }
	])
	.then((answers) => {
		if (answers.confirm) {
			nodeLogActivity('Run again the option ?', 'Yes');
			runoption();
		} else {
			nodeLogActivity('abort activity', 'No');
			console.log("\nBye!\n");
		}
	})
}


function getMyTweets() {
	var client = new twitter(keys.twitterKeys);
	var queryUrl = "https://api.twitter.com/1.1/search/tweets.json?q=oleh_kmyta_2005&result_type=recent&count=20";

	client.get(queryUrl, (error, tweets, response) => {

		if (error) {
			logErrors('getMyTweets()', '@oleh_kmyta_2005');
			console.log(error);
		}

		console.log("\nHere are tweets from @oleh_kmyta_2005: \n");
   		
   		for (var i = 0; i < tweets.statuses.length; i++) {
			   console.log(tweets.statuses[i].created_at)
			   console.log(tweets.statuses[i].text)
   		}
   		console.log('');	
	});

	nodeLogActivity('my-tweets           ', '@oleh_kmyta_2005');

	setTimeout(reRunoption, 1000);
}


function getMusicInfo(song) {
	var Spotify = new spotify(keys.spotifyKeys);
 
	Spotify.search({ type: 'track', query: song, limit: 1 }, (err, data) => {
		if (err) {
			logErrors('getMusicInfo()', song);
			return console.log(`\n${err}\n`);
		
		}
		
		var artistName = data.tracks.items[0].album.artists[0].name;
		var songName = data.tracks.items[0].name;
		var songURL = data.tracks.items[0].album.artists[0].external_urls.spotify;
		var albumName = data.tracks.items[0].album.name;
		
		console.log("\nGreat choice!\n");
		console.log(`Nice '${songName}' by ${artistName}. Is this one from album '${albumName}'?`);
		console.log(`listen to it at ${songURL}\n`);

		nodeLogActivity('spotify-this-song   ', song);

		setTimeout(reRunoption, 1000);
	});
}


function getMovie(movie) {
	var apiKey = "40e9cece";
	var movieQueryUrl = `http://www.omdbapi.com/?t=${movie}&apikey=${apiKey}`;

	var callback = function(error, response, body){
	if (JSON.parse(body).Response === 'False') {
		console.log("\nNo such movie, try again?\n");
		logErrors('getMovie()', movie);
		reRunoption();

	} else if (!error && response.statusCode === 200) {

		var title = JSON.parse(body).Title; 
		var movieYear = JSON.parse(body).Year;
		var rated = JSON.parse(body).Rated;
		var country = JSON.parse(body).Country;
		var plot = JSON.parse(body).Plot;
		var actors = JSON.parse(body).Actors;
		var language = JSON.parse(body).Language;
		var IMDB_Rating;
		var rotten_Rating;

		if (JSON.parse(body).Ratings[0]) {
			IMDB_Rating = JSON.parse(body).Ratings[0].Value;
		} else {
			IMDB_Rating = 'undefined';
		}

		if (JSON.parse(body).Ratings[1]) {
			rotten_Rating = JSON.parse(body).Ratings[1].Value;
		} else {
			rotten_Rating = 'undefined';
		}

		console.log("\nGood choice!\n");
		console.log(` movie '${title}', starring ${actors}. \nIt was released in ${country} in ${movieYear}, with an IMDB rating of ${IMDB_Rating} and Audience ${rated}, and Rotten Tomatoes rating of ${rotten_Rating}, and is broadcasted in ${language}.\n`);
		console.log(`Check out the movie's plot:\n`);
		console.log(`${plot}\n`)

		nodeLogActivity('movie-this          ', movie);

		setTimeout(reRunoption, 1000);

	} else {
		logErrors('getMovie()', movie);
		return console.log(error);
	}	
};
request(movieQueryUrl, callback);

}


		

function doWhatitSays() {

	fs.readFile('random.txt', 'utf8', function (error, data) {
	if (error) {
		return console.log(error);
	}
	var dataArr = data.split(",");
	if (dataArr.length == 2) {
		reRunoption(dataArr[0], dataArr[1]);
	} else if (dataArr.length == 1) {
		reRunoption(dataArr[0]);
	}
	  console.log(dataArr[i]);
	  console.log("\nGreat choice!\n");

	  logStuffThatHappens('spotify-this-song   ');

	  setTimeout(reRunProgram, 1000);
  
	
})
}


function nodeLogActivity(func, query) {
	var stuffD = new Date();
	fs.appendFile("log.txt", `\n ${stuffD.getTime()}: User requested: '${func}' with a query of '${query}',`, (err) => {

		if (err) {
			logErrors('nodeLogActivity()', query);
			return console.log(err);
		}
	});
}


function logErrors(func, query) { 
	var errorD =new Date();              
	fs.appendFile("log.txt", `\n ${errorD.getTime()}:  Error Occured: 'running: '${func}' with a query of '${query}',`, (err) => {

		if (err) {
			logErrors('logErrors()', query);
			return console.log(err);
		}
	});
}




