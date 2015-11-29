var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var jsonHttp = require('json-http');
var fs = require('fs');

jsonHttp.getJson('http://ipinfo.io/json', function(err, response){

  var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos);

  var pageToVisit = "http://4.ipinfo.io/"+asn;

  request(pageToVisit, function(error, response, body) {
     if(error) {
       console.log("Error: " + error);
     }
     if(response.statusCode === 200) {
       var $ = cheerio.load(body);
       var ip = [];
       $('tr td a').each(function(i, elem){
         ip[i] = $(this).text();
       });
       for(var i = 1, newip = []; i < ip.length - 1; i++){
         if( ip[i] === "" ){
           ip.splice(i, 1);
         }
         newip[i -1] = ip[i];
       }
       console.log(newip);
    }
  });

  //fs.writeFile( asn +'.txt', asn, function(err) {
  //if (err)
  //  console.log(err);
  //else
  //  console.log('Operacion completada');
  //});
});
