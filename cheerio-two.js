var request = require('request'), cheerio = require('cheerio'), jsonHttp = require('json-http'), fs = require('fs'), readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write("Bloques de IPs a partir del ASN\n");
rl.question("Ingrese la IP de la cual desea obtener?", function(reqip){

  jsonHttp.getJson('http://ipinfo.io/'+reqip+'/json', function(err, response){

    var res = response.org, pos = res.indexOf(" "), asn = res.substring(0, pos);

    var pageToVisit = "http://4.ipinfo.io/"+asn;

    request(pageToVisit, function(error, response, body) {
       if(error) {
         console.log("Error: " + error);
       }
       if(response.statusCode === 200) {
         var $ = cheerio.load(body), ip = [];

         $('tr td a').each(function(i, elem){
           ip[i] = $(this).text();
         });
         for(var i = 1, newip = []; i < ip.length - 1; i++){
           if( ip[i] === "" ){
             ip.splice(i, 1);
           }
           newip.push({bloque : ip[i]});
         }
         console.log(newip);
      }
      fs.writeFile( asn + "-" + ip[0] + '.txt', JSON.stringify(newip), function(err) {
      if (err)
        console.log(err);
      else
        console.log('Operacion completada');
      });
    });
  });
});
