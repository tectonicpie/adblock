const request = require('request');
var dateTime = require('node-datetime');
var path = require('path');
var bodyParser = require('body-parser');
var express = require("express");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

 app.get("/update", function(req, res){
    var date = new Date("11-28-2017 12:00");

	console.log('Returning: ' + getDateTime(date) + '\n');
	res.send(getDateTime(date));
});

 app.get("/file", function(req, res){ 
	console.log('Processing download');
	res.download(path.join(__dirname, "../adblock/adfile.txt"));
});

var port = process.env.PORT || 8200;
 app.listen(port, function() {
 console.log("Listening on " + port);
});

function getDateTime(date) {

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "-" + day + "-" + year + " " + hour + ":" + min ;
}


var Set = require("collections/set");
const request = require('request');
var http = require('http');
var fs = require('fs');
var lineReader = require('line-reader');

var urls = new Set();

// Set the headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

// Configure the request
var bodyParser = require('body-parser');
var express = require("express");

console.log(urls.size);
var serverIp = "127.0.0.1";
var filePath = 'dnld.txt'
var downloadUrl = 'http://'+serverIp+':8200/file';
var updateUrl = 'http://'+serverIp+':8200/update';

//setup local list
download(downloadUrl, updateList);
var lastUpdated = new Date("11-28-2017 11:59");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

 app.get("/url/:url", function(req, res){ 
    if (req.params.url==null)
    {
        res.send("404");
    }
    else if (urls.has(req.params.url))
    {
        console.log("Found: ", req.params.url);
        res.send("1");
    }
    else {
        console.log("Didnt find: ", req.params.url);
        res.send("0");
    }
});

// app.post("/url", function(req, res) { 
// /* some server side logic */
//  if (req.body.url==null)
//  {
//      res.send("404");
//  }
//  else if (urls.has(req.body.url))
//  {
//      console.log("Found: ", req.body.url);
//      res.send("1");
//  }
//  else {
//      console.log("Didnt find: ", req.body.url);
//      res.send("0");
//  }
// });

// this interval is 1 minute
the_interval = 1 * 30 * 1000;
setInterval(function() {
    console.log("Checking for update");
    //var url = 'http://127.0.0.1:8200/update';
    var options = {
        url: updateUrl,
        method: 'GET',
        headers: headers,
        qs: {}
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var date = new Date(body);
            if (date>lastUpdated)
            {
                console.log("New update available, Server time: " + getDateTime(date) + " Last Updated: " + getDateTime(lastUpdated));
                //url = 'http://127.0.0.1:8200/file';
                download(downloadUrl, updateList);
                lastUpdated = date;
            }
            else {
                console.log("No new update available, Server time: " + getDateTime(date) + " Last Updated: " + getDateTime(lastUpdated));
            }
        }
    });
}, the_interval);

function updateList()
{
    var updatedUrls = new Set();
  
    lineReader.eachLine(filePath, function(line, last) {
        updatedUrls.add(line);
        if(last){
            console.log("Updated list, size: ", updatedUrls.size);
            urls = updatedUrls;
        }
    });
}

var port = process.env.PORT || 8100;
 app.listen(port, function() {
 console.log("Listening on " + port);
});

function getDateTime(date) {

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "-" + day + "-" + year + " " + hour + ":" + min ;
}

function download (url, cb) {
  var file = fs.createWriteStream(filePath);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb());
      console.log("Download complete");  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest);
    console.log(err.message);
  });
};