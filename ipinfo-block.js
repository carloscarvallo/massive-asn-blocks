var request = require('request'), cheerio = require('cheerio'), jsonHttp = require('json-http'), fs = require('fs'), readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write("===============================\n");
rl.write("Bloques de IPs a partir del ASN\n");
rl.write("===============================\n\n");

jsonHttp.getJson('http://ipinfo.io/json', function (err, res){
  rl.write("Su ip actual es: "+ res.ip +"\n\n");

  rl.question("Ingrese IP de referencia: ", function(reqip){

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
           ip[i] = $(this).text();
         });
         for(var i = 1, newIp = []; i < ip.length - 1; i++){
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
      fs.writeFile( asn + "-" + ip[0] + '.txt', JSON.stringify(newIp), callback );
    }
    request(page, reqCallback);
  }
  jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', resCallback);
  rl.close();
  });
});
