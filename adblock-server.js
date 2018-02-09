const request = require('request');
var dateTime = require('node-datetime');
var path = require('path');
var bodyParser = require('body-parser');
var express = require("express");
//var timeout = require('connect-timeout');
var fs = require('fs');

var app = express();
//app.use(timeout('100s'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var currentFile = "local.txt";

// app.use(function(req, res, next){
//     res.setTimeout(120000, function(){
//         console.log('Request has timed out.');
//             res.send(408);
//         });

//     next();
// });

app.get("/updateFile", function(req, res){
    var path = "./adlists";
    var adlists = [];
    fs.readdir(path, function(err, items) {
        //console.log(items);
 
        for (var i=0; i<items.length; i++) {
            //console.log(items[i]);
            var date = new Date(items[i]);
            adlists.push(date);
        }
        //console.log(adlists.length);

        adlists.sort(date_sort_desc);
        for (var i=0; i<adlists.length; i++) {
            //console.log(adlists[i]);
        }

        if (adlists.length>0)
        {
            currentFile = "./adlists/" + getDateTime(adlists[0]);
        }
        else {
            currentFile = "local.txt";
        }
        //console.log("currentFile is :" + currentFile);
        //var date = new Date("12-05-2017 12:00");
        console.log('Returning: ' + getDateTime(adlists[0]) + '\n');
        res.send(getDateTime(adlists[0]));
    });
});

app.get("/update", function(req, res){
    var path = "./adlists";
    var adlists = [];
    fs.readdir(path, function(err, items) {
        //console.log(items);
 
        for (var i=0; i<items.length; i++) {
            //console.log(items[i]);
            var date = new Date(items[i]);
            adlists.push(date);
        }
        //console.log(adlists.length);

        adlists.sort(date_sort_desc);
        for (var i=0; i<adlists.length; i++) {
            //console.log(adlists[i]);
        }

        if (adlists.length>0)
        {
            currentFile = "./adlists/" + getDateTime(adlists[0]);
        }
        else {
            currentFile = "local.txt";
        }
        //console.log("currentFile is :" + currentFile);
        //var date = new Date("12-05-2017 12:00");
        console.log('Returning: ' + getDateTime(adlists[0]) + '\n');
        res.send(getDateTime(adlists[0]));
    });
});

app.get("/file", function(req, res){ 
    var ip = 'local';
	console.log('Processing download for: ', ip);
    console.log("serving file: ", currentFile);
	res.download(path.join(__dirname, currentFile));
    console.log('Processed download for: ', ip);
});

var port = process.env.PORT || 8200;
 app.listen(port, function() {
 console.log("Listening on " + port);
});

function sortFunction(a,b){  
    var dateA = new Date(a.date).getTime();
    var dateB = new Date(b.date).getTime();
    return dateA > dateB ? 1 : -1;  
};

var date_sort_asc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

var date_sort_desc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // DESCENDING order.
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};

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

    return month + "-" + day + "-" + year + "-" + hour + ":" + min ;
}