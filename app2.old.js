var request = require('request'),
cheerio = require('cheerio'),
jsonHttp = require('json-http'),
fs = require('fs'),
readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write("===============================\n");
rl.write("Bloques de IPs a partir del ASN\n");
rl.write("===============================\n\n");

jsonHttp.getJson('http://ipinfo.io/json', function(err, res) {
  rl.write("Su ip actual es: "+ res.ip +"\n\n");
  rl.question("Ingrese IP de referencia: ", function(reqip) {
  rl.close();
    jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', function(err, response){
      var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos),
      country = response.country, page = "http://4.ipinfo.io/"+asn;
      request(page, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        if(response.statusCode === 200) {
          var $ = cheerio.load(body), ip = [[]], relatedASN = [];

          $('.table tr td a').each(function(i, elem){
            var text = $(this).text();
            if (i !== 0 && text !== ""){
              if (!(text.indexOf("AS") == 0)) {
                var p = text.indexOf("/");
                var red = text.substring(0, p);
                var cant = text.substring(p+1);
                ip.push([red, cant]);
              } else {
                relatedASN.push(text);
              }
            }
          });
          ip.splice(0, 1);
          for (var i = 0; i < ip.length; i++){
            var netblock = ip[i][0], numIPs = ip[i][1];
            console.log("Red: "+ netblock + " Cantidad: " + numIPs);
          }
        }
      });
    });
  });
});
