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

var jsonCallback = function (err, res){

  rl.write("Su ip actual es: "+ res.ip +"\n\n");

  var questionCallback = function(reqip){
    var resCallback = function(err, response){
      var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos),
      country = response.country, page = "http://4.ipinfo.io/"+asn;

      var reqCallback = function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        if(response.statusCode === 200) {
          var $ = cheerio.load(body), ip = [], cantIp = [], relatedASN = [];

          $('.table tr td a').each(function(i, elem){
            var text = $(this).text();
            if (text !== ""){
              if (!(text.indexOf("AS") == 0)) {
                var p = text.indexOf("/");
                var red = text.substring(0, p);
                var cant = text.substring(p+1);
                ip.push(red, cant);
              } else {
                relatedASN.push(text);
              }
            }
          });
          ip.splice(0, 2);
          console.log(ip);
          console.log("Related ASN:\n");
          console.log(relatedASN);
        }
        var callback = function(err) {
          if (err)
          console.log(err);
          else
          console.log('Operacion completada');
        }
        fs.writeFile( asn + "-" + country + '.txt', JSON.stringify(ip), callback );
      }
      request(page, reqCallback);
    }
    jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', resCallback);
    rl.close();
  };
  rl.question("Ingrese IP de referencia: ", questionCallback );
};
jsonHttp.getJson('http://ipinfo.io/json', jsonCallback);
