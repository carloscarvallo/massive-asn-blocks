const readline = require('readline'),
      qhttp    = require('q-io/http'),
      cheerio  = require('cheerio'),
      request  = require('request');
      ipinfo   = require('../providers/ipinfo'),

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

var asnScrap = function(callback) {
    getInput()
        .then(function(input) {


qhttp.read(ipinfo.url+'/countries/'+input)
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

            request(ipinfo.url+reqASN, function( err, response, body ){
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

var blockScrap = function(page, callback) {
    var $ = cheerio.load(page), blocks = [];
    $('.table tr td a').each(function(i, elem){
        var text = $(this).text();
        if (i !== 0 && text !== ""){
            if (text.indexOf("AS") !== 0) {
                var p = text.indexOf("/");
                var red = text.substring(0, p);
                var cant = text.substring(p+1);
                blocks.push([red, cant]);
            }
        }
    });
    callback(blocks);
};


exports.asn = asnScrap;
exports.block = blockScrap;
