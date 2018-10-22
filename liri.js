//------------------------------------------------------------------------------------------------------------------------------------
//-------------------------- No Vars for this assignment!
require("dotenv").config();

//node module imports needed for functions
const Spotify = require('node-spotify-api');
const request = require("request");
const moment = require('moment');
const fs = require("fs");
const keys = require("./keys.js"); //file that will direct the terminal to .env file

// Establishing the switch cases for the wanted actions of Liri
LiriCommands();

// My functin for running the commands for liri
function LiriCommands() {
    switch (action) {
        case "ShowEventInfo":
            ShowEventInfo();
            break;
        //---------------------
        case "SpotifySong":
            SpotifySong();
            break;
        //---------------------
        case "thisMovie":
            thisMovie();
            break;
        //---------------------
        case "DoWhatItSays":
            DoWhatItSays();
            break;
            // cases for switching to initiated commands.
        default:
            console.log("choose a command: ShowEventInfo, SpotifySong, thisMovie, or DoWhatItSays");
    };
}

function ShowEventInfo(event){
    const date = moment(event.datetime, moment.ISO_8601).format('MM/DD/YYYY');
    console.log('=/This_Concert/=');
    console.log(`Lineup: ${(event.lineup).toString().replace(/,/g, ', ')}`);
    console.log(`Venue: ${event.venue.name}`);
    (event.venue.region !== "") ? console.log(`Location: ${event.venue.city}, ${event.venue.region}`) : 
    console.log(`Location: ${event.venue.city},${event.venue.country}`);
    console.log(`Date: ${date}`); console.log('');
    fs.appendFile('log.txt', `\nLineup: ${(event.lineup).toString().replace(/,/g, ', ')}\nVenue: ${event.venue.name}\nLocation: 
    ${event.venue.city}, ${event.venue.region}, ${event.venue.country}\nDate: ${date}\n\n`, (error) => {if(error) throw error;});
}

// function that will display spotify data
function SpotifySong() {

    const spotify = new Spotify(keys.spotify);
    const args = process.argv;
    const thesongName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            thesongName = thesongName + " " + args[i];
        } else {
            thesongName = args[i];
        }
    };
    if (args.length < 4) {
        thesongName = "I Want it That Way"
        process.argv[3] = thesongName;
    }
    spotify.search({
        type: "track",
        query: thesongName,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log("ya' messed up!: " + err);
            return;
        }
        console.log("-------------------------------------------------------------------------------------------");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-------------------------------------------------------------------------------------------");
    });
};

// function that displays movie data
function thisMovie() {

    const args = process.argv;
    const themovieName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            themovieName = themovieName + "+" + args[i];
        } else {
            themovieName = args[i];
        }
    };

    if (themovieName === "") {
        themovieName = "Mr." + "+" + "Nobody"
    };

    // running a single request to the OMDB API with the 'specified movie'
    const queryUrl = "http://www.omdbapi.com/?t=" + themovieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`--------------------`);
            console.log(`IMDB Rating: ${imdb}`);
            console.log(`Movie Title: ${JSON.parse(body).Title}`);
            console.log(`Release Year: ${JSON.parse(body).Year}`);
            console.log(`Rotten Tomatoes Rating: ${rotten}`)
            console.log(`Country: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actor(s): ${JSON.parse(body).Actors}`);
            console.log(`--------------------`);
        } else {
            console.log("ya' messed up!");
        }
    });
};

// My random fs (dowhatitsays) function
function DoWhatItSays() {

    fs.readFile("./random.txt", "utf8", function (error, data) {
        if(error) throw (error);
        let LiriCommands = data.split(',');
        for(const i in liriCommand){
            LiriCommands[i] = LiriCommands[i].trim();   
            LiriCommands[i] = LiriCommands[i].replace(/"/g, '');  
        }
        const data = data.split(',');
        // Loop for my early established 'LiriComands'
        LiriCommands(); 
    })
};