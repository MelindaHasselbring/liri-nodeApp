//Required dependencies
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var fs = require('fs');
var dateTime = require('node-datetime');


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
                    var tweetLog = '';
                    //For loop to iterate through all 20 tweets
                    for (i = 0; i < 20; i++) {
                        var c = i+1;
                        console.log(`${c}  ${tweets[i].text} on ${tweets[i].created_at}`);
                        tweetLog = `${tweetLog} ${c}  ${tweets[i].text} on ${tweets[i].created_at}\r\n`;
                        console.log('------------------------------------------------------------------------------------');
                    }
                } else {

                    //Logging errors
                    console.log(error);
                }
                liri_log(tweetLog);
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
                var spotify_log = '';

                for (i = 0; i < data.tracks.items.length; i++) {
                    for (x = 0; x < data.tracks.items[i].album.artists.length; x++) {
                        console.log(`Artist:      ${data.tracks.items[i].album.artists[x].name}`);
                        spotify_log = `${spotify_log}Artist:      ${data.tracks.items[i].album.artists[x].name}\r\n`;
                        console.log(`Title:       ${data.tracks.items[i].name}`);
                        spotify_log = `${spotify_log}Title:       ${data.tracks.items[i].name}\r\n`;
                        console.log(`Preview URL: ${data.tracks.items[i].preview_url}`);
                        spotify_log = `${spotify_log}Preview URL: ${data.tracks.items[i].preview_url}\r\n`;
                        console.log(`Album:       ${data.tracks.items[i].album.name}`);
                        spotify_log = `${spotify_log}Album:       ${data.tracks.items[i].album.name}\r\n`;
                        console.log('----------------------------------------------------------');
                        spotify_log = `${spotify_log}----------------------------------------------------------\r\n`;
                    }
                }
                liri_log(spotify_log);
            });
            break;
        //OMDB API
        case 'movie-this':
            //Basic REST API that returns an object on request
            var movie_log = '';
            request('http://www.omdbapi.com/?apikey=40e9cece&t=' + process.argv[3], function (error, response, body) {
                console.log(`Title:                ${JSON.parse(body).Title}`);
                movie_log = `${movie_log}Title:                ${JSON.parse(body).Title}\r\n`;
                console.log(`Year:                 ${JSON.parse(body).Year}`);
                movie_log = `${movie_log}Year:                 ${JSON.parse(body).Year}\r\n`;
                console.log(`IMDB Rating:          ${JSON.parse(body).imdbRating}`);
                movie_log = `${movie_log}IMDB Rating:          ${JSON.parse(body).imdbRating}\r\n`;
                console.log(`Country:              ${JSON.parse(body).Country}`);
                movie_log = `${movie_log}Country:              ${JSON.parse(body).Country}\r\n`;
                console.log(`Language:             ${JSON.parse(body).Language}`);
                movie_log = `${movie_log}Language:             ${JSON.parse(body).Language}\r\n`;
                console.log('Plot:                 ' + JSON.parse(body).Plot);
                movie_log = `${movie_log}Plot:                 ${JSON.parse(body).Plot}\r\n`;
                console.log(`Casts:                ${JSON.parse(body).Actors}`);
                movie_log = `${movie_log}Casts:                ${JSON.parse(body).Actors}\r\n`;
                console.log('Rotten Tomatoes URL:   https://www.i-haveNoClue.com#FoReals');
                movie_log = movie_log+'Rotten Tomatoes URL:   https://www.i-haveNoClue.com#FoReals' + '\r\n';
                liri_log(movie_log);
            });
            break;
    }
}
//Log function that will be called every time something needs to be logged
function liri_log(msg) {
    var dt = dateTime.create();
    var dtg;
    dtg = dt.format('Y-m-d H:M:S');
    fs.appendFileSync('liri_log.txt', '\r\n');
    fs.appendFileSync('liri_log.txt', '------------------------------------------------------------------------------------------------\r\n##############################' + dtg + '\r\n------------------------------------------------------------------------------------------------\r\n');
    fs.appendFileSync('liri_log.txt', msg + '\r\n');
}

if (process.argv[2] === 'do-what-it-says') {
    fs.readFile('./random.txt', "utf-8", function (err, data) {
        if (err) throw err;
        var obj = data.split(',');
        process.argv[2] = obj[0];
        process.argv[3] = obj[1];
        execute();
    });
} else {
    execute();
}