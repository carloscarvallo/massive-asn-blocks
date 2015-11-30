var request = require('request'), cheerio = require('cheerio'), jsonHttp = require('json-http'), fs = require('fs'), readline = require('readline');

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
      var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos);
      var page = "http://4.ipinfo.io/"+asn;

      var reqCallback = function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        if(response.statusCode === 200) {
          var $ = cheerio.load(body), ip = [];

          $('tr td a').each(function(i, elem){
            var text = $(this).text();
            ip[i] = text;
          });
          var country = ip.shift();
          for(var i = 0, newIp = []; i < ip.length; i++){
            if( ip[i] === "" ){
              ip.splice(i, 1);
            }
            newIp.push(ip[i]);
          }
          console.log(newIp);
        }
        var callback = function(err) {
          if (err)
          console.log(err);
          else
          console.log('Operacion completada');
        }
        fs.writeFile( asn + "-" + country + '.txt', JSON.stringify(newIp), callback );
      }
      request(page, reqCallback);
    }
    jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', resCallback);
    rl.close();
  };
  rl.question("Ingrese IP de referencia: ", questionCallback );
};
jsonHttp.getJson('http://ipinfo.io/json', jsonCallback);
