//Required dependencies
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');

//Switch statement inside a function to allow running switch under different state
//Could've been done in OOP manner but seems a bit overkill
function execute() {
    //Switch statement to separate each codes in blocks resulting in cleaner code
    switch (process.argv[2]) {
        //Twitter API
        case 'my-tweets':
            //Building the client object using the supplied keys
            var client = new Twitter({
                consumer_key: keys.twitterKeys.consumer_key,
                consumer_secret: keys.twitterKeys.consumer_secret,
                access_token_key: keys.twitterKeys.access_token_key,
                access_token_secret: keys.twitterKeys.access_token_secret
            });

            //Defining the targeted twitter user. change param.screen_name to the twitter handler that you want to target.
            var params = {screen_name: 'nodejs'};//This will show 20 of nodejs' tweets

            client.get('statuses/user_timeline', params, function (error, tweets, response) {
                if (!error) {
                    console.log(tweets[0].user.name + ' tweeted:');//This will grab the target's name and print int on the screen

                    //For loop to iterate through all 20 tweets
                    for (i = 0; i < 20; i++) {
                        console.log(i + 1 + ' ) ' + tweets[i].text + ' on ' + tweets[i].created_at);
                        console.log('------------------------------------------------------------------------------------');
                    }
                } else {

                    //Logging errors
                    console.log(error);
                }
            });
            break;
        //Spotifi API
        case 'spotify-this-song':

            var song;

            if (!process.argv[3]) {
                song = '"The Sign" by ace of base';
            } else {
                song = process.argv[3];
            }

            var spotify = new Spotify({
                id: keys.spotifyKeys.id,
                secret: keys.spotifyKeys.secret
            });

            spotify.search({type: 'track', query: song}, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                for (i = 0; i < data.tracks.items.length; i++) {
                    for (x = 0; x < data.tracks.items[i].album.artists.length; x++) {
                        console.log('Artist:      ' + data.tracks.items[i].album.artists[x].name);
                        console.log('Title:       ' + data.tracks.items[i].name);
                        console.log('Preview URL: ' + data.tracks.items[i].preview_url);
                        console.log('Album:       ' + data.tracks.items[i].album.name);
                        console.log('----------------------------------------------------------');
                    }
                }

            });
            break;
        //OMDB API
        case 'movie-this':
            request('http://www.omdbapi.com/?apikey=40e9cece&t=' + process.argv[3], function (error, response, body) {
                console.log('Title:                ' + JSON.parse(body).Title);
                console.log('Year:                 ' + JSON.parse(body).Year);
                console.log('IMDB Rating:          ' + JSON.parse(body).imdbRating);
                console.log('Country:              ' + JSON.parse(body).Country);
                console.log('Language:             ' + JSON.parse(body).Language);
                console.log('Plot:                 ' + JSON.parse(body).Plot);
                console.log('Casts:                ' + JSON.parse(body).Actors);
                console.log('Rotten Tomatoes URL:   https://www.i-haveNoClue.com#FoReals');
            });
            break;
    }
}


if (process.argv[2] === 'do-what-it-says') {
    fs.readFile('./random.txt', "utf-8", function (err, data) {
        if (err) throw err;
        console.log(data);
        var obj = data.split(',');
        process.argv[2] = obj[0];
        process.argv[3] = obj[1];
        execute();
    });
}else{
    execute();
}