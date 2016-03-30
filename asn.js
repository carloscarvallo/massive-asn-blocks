var request = require('request'),
cheerio = require('cheerio'),
country = {},
readline = require('readline'),
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = function( callback ){
    rl.question("Type the ISO code of the country to scan (ex. PY Paraguay, AR Argentina): ", function( resp ){
      request('http://ipinfo.io/countries/'+resp, function( err, response, html ){
        if (!err && response.statusCode == 200) {
          var $ = cheerio.load(html);
          var name = $('#heading').text();
          var text = "", org = "";
          var blockArray = [];
          $('tr').each(function(i, element) {
            text = $(this).children().first().text();
            if (text !== ""){
              org = $(this).children().first().next().text();
              blockArray.push([text, org]);
            }
          });
          blockArray.splice(0, 1);
          country.name = name;
          country.ASN = [];
          rl.write("\n");
          for (var i = 0; i < blockArray.length; i++){
            console.log((i+1)+". "+blockArray[i][0]+" "+blockArray[i][1]);
            country.ASN.push({ _id: i+1, dir: blockArray[i][0], name: blockArray[i][1]});
          }
          rl.write("\n");
          rl.question("Enter the number of the ASN do you want to scan : ", function( reqip ) {
            rl.write("\n");
            // Name of the ASN
            console.log( blockArray[reqip-1][1] );
            rl.close();
            request('http://ipinfo.io/'+blockArray[reqip-1][0], function( err, response, body ){
            callback(body);
          });
        });
      }
    });
  });
};
