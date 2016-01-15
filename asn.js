var request = require('request'),
cheerio = require('cheerio'),
readline = require('readline'),
rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function init(callback){
  rl.question("Type the ISO code of the country to scan (ex. PY Paraguay, AR Argentina): ", function(resp){
    request('http://ipinfo.io/countries/'+resp, function(err, response, html){
      if (!err && response.statusCode == 200) {
        var $ = cheerio.load(html);
        var blockArray = [[]];
        $('tr').each(function(i, element) {
          var text = $(this).children().first().text();
          if (text !== ""){
            var org = $(this).children().first().next().text();
            blockArray.push([text, org]);
          }
        });
        blockArray.splice(0, 2);
        rl.write("\n");
        for (var i = 0; i < blockArray.length; i++){
          console.log((i+1)+". "+blockArray[i][0]+" "+blockArray[i][1]);
        }
        rl.write("\n");
        rl.question("Enter the number of the ASN do you want to scan : ", function(reqip) {
          rl.write("\n");
          console.log(blockArray[reqip-1][1]);
          rl.close();
          request('http://ipinfo.io/'+blockArray[reqip-1][0], function(err, response, body){
            callback(body);
          });
        });
      }
    });
  });
};

exports.init = init;
