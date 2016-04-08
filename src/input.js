const readline = require('readline'),
      qhttp    = require('q-io/http'),
      cheerio  = require('cheerio'),
      request  = require('request');
      url      = 'http://ipinfo.io/',

rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var getInput = function() {
    return new Promise(function(resolve, reject) {

        var count = 0;
        count++;
        rl.question("Type the ISO code of the country (ex. PY Paraguay, AR Argentina): ", function(resp) {
            if ( !resp ) {
                reject(new Error('country needed!'));
            } else {
                resolve(resp);
            }
        });

    })
};

function scrap (callback) {
    getInput()
        .then(function(input) {


qhttp.read(url+'/countries/'+input)
    .then(function(data){

        return data.toString();

    }, console.error)
    .then(function(html){

        var $ = cheerio.load(html);
        var name = $('#heading').text();
        var text = "", org = "";
        var blockArray = [];
        $('tr').each(function() {
            text = $(this).children().first().text();
            if (text !== ""){
                org = $(this).children().first().next().text();
                blockArray.push([text, org]);
            }
        });
        blockArray.splice(0, 1);

        return blockArray;

    }, console.error)
    .then(function(block){

        block.map(function(item, index){
            console.log('%s. %s %s', index+1, block[index][0], block[index][1]);
        });

        var reqASN = 0;
        rl.question("Enter the number of the ASN do you want to scan : ", function( reqip ) {

            // Name of the ASN
            reqASN = block[reqip-1][0];
            var namASN = block[reqip-1][1];
            console.log( namASN );
            rl.close();
            
            request('http://ipinfo.io/'+reqASN, function( err, response, body ){
                callback(body);
            });

        });
    }, console.error)
    .done();

        }, function(err){
            console.error(err.message);
            scrap();
        });

};

exports.scrap = scrap;
