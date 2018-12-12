var axios = require("axios");
const dotenv = require('dotenv').config();
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var filePath = "./random.txt";
var delimeter = ',';
// process.env now has the keys and values you defined in your .env file.

function runLiri(command, inputParam) {



  if (command === "concert-this") {

    // Run the axios.get function...
    // The axios.get function takes in a URL and returns a promise (just like $.ajax)
    axios.get("https://rest.bandsintown.com/artists/" + inputParam + "/events?app_id=codingbootcamp").then(
      function (response) {

        response.data.forEach(function (data) {

          console.log('Venue Name: ' + data.venue.name);
          console.log('Venue Location: ' + data.venue.city + ', ' + data.venue.country);
          console.log('Date of Event: ' + moment(data.datetime).format("MM-DD-YYYY"));
          console.log('--------------------');

        });


      },


      function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      }
    );

  } else if (command === "spotify-this-song") {

    if (inputParam === undefined) {
      inputParam = "Ace of Base The Sign";
      console.log("You did not specify a parameter.  We defaulted to: " + inputParam + ". Enjoy!!")
    }

    var spotify = new Spotify(keys.spotify);

    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });

    spotify.search({
      type: 'track',
      query: inputParam
    }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      data.tracks.items.forEach(function (value) {

        value.artists.forEach(function (artists) {
          console.log("Artist(s): " + artists.name);
        });

        console.log("Song Name: " + value.name);
        console.log("Spotify preview: " + value.album.external_urls.spotify);
        console.log("Album name: " + value.album.name);
        console.log('--------------------');

      });

    });


  } else if (command === "movie-this") {

    if (inputParam === undefined) {
      inputParam = "Mr. Nobody";
    }

    axios.get(
      "https://www.omdbapi.com/?t=" + inputParam + "&y=&plot=short&apikey=trilogy"

    ).then(
      function (response) {


        
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);

        response.data.Ratings.forEach(function (value) {

          if (value.Source === "Internet Movie Database") {
            console.log("IMDB Rating: " + value.Value);
          }

          if (value.Source === "Rotten Tomatoes") {

            console.log("Rotten Tomatoes Rating: " + value.Value);
          }


        });

        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);

      },


      function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      }
    );





  } else if (command === "do-what-it-says") {

    fs.readFile(filePath, 'UTF8', function (error, data) {

      if (error) {
        return console.log(error);
      }

      var stringArr = data.split(delimeter);
      runLiri(stringArr[0], stringArr[1]);


    });












  }


}

var command ="";
var inputParam ="";


process.argv.forEach(function(value,index){

  if (index ===2){
    command = value;
  }
  //concatenates the input parameters from the command line
  if (index > 2){
    inputParam += value + ' ';
  }


});


console.log(inputParam);

runLiri(command, inputParam);

