var request = require('request'),
cheerio = require('cheerio'),
jsonHttp = require('json-http'),
fs = require('fs'),
readline = require('readline'),
async = require('async'),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write("=================\n");
rl.write("Massive IP blocks\n");
rl.write("=================\n\n");

async.waterfall(
  [
    function(callback){
      jsonHttp.getJson('http://ipinfo.io/json', function(err, res) {
        rl.write("Your IP: "+res.ip+"\n\n");
        rl.write("Country: "+res.country+"\n\n");
        rl.write("ASN: "+res.org+"\n\n");
        scp = cheerio.load('http://ipinfo.io/countries/'+res.country);
        scp('table tr td a').each(function(i, elem){
         rl.write(elem);
        });
        rl.question("ENTER to use your IP or type for another: ", function(reqip) {
          rl.close();
          callback(null, reqip);
        });
      });
    },

    function(reqip, callback){
      jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', function(err, response){
        var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos),
        country = response.country, page = "http://4.ipinfo.io/"+asn;
        callback(null, page);
      });
    },

    function(page, callback){
      request(page, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        if(response.statusCode === 200) {
          var $ = cheerio.load(body), blocks = [[]], relatedASN = [];
          $('.table tr td a').each(function(i, elem){
            var text = $(this).text();
            if (i !== 0 && text !== ""){
              if (!(text.indexOf("AS") == 0)) {
                var p = text.indexOf("/");
                var red = text.substring(0, p);
                var cant = text.substring(p+1);
                blocks.push([red, cant]);
              } else {
                relatedASN.push(text);
              }
            }
          });
          blocks.splice(0, 1);
          callback(null, blocks);
        }
      });
    }
  ],

  function(err, blocks) {
    for (var i = 0; i < blocks.length; i++) {
      var netblock = blocks[i][0], numIPs = blocks[i][1];
      console.log("\n");
      console.log(clc.blue(blocks[i][0]+"/"+blocks[i][1]));
      child = spawnSync('nmap', ['-n', '-P0', '-vvv', netblock+"/"+numIPs], {stdio:[0,1,2]});
    }
  }
);
