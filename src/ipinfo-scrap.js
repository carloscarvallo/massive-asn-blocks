const readline = require('readline'),
      qhttp    = require('q-io/http'),
      cheerio  = require('cheerio'),
      rp       = require('request-promise');
      ipinfo   = require('../providers/ipinfo'),

rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var getInput = new Promise(function(resolve, reject) {

    rl.question("Type the ISO code of the country (ex. PY Paraguay, AR Argentina): ", function(resp) {
        if ( !resp ) {
            reject(new Error('country needed!'));
        } else {
            resolve(resp.toLowerCase());
        }
    });

});

var asnScrap = function (callback) {
    getInput.then(function(input) {

        var options = {
            uri: ipinfo.url+'countries/'+input,
            transform: function(body) {
                return cheerio.load(body);
            }
        };

        rp(options)
        .then(function ($) {

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

        })
        .catch(function (err) {
            // REQUEST ERROR TREATMENT
            console.error(err);
        })
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


                rp(ipinfo.url+reqASN)
                .then(function (body) {
                    callback(body);
                })
                .catch(function (err) {
                    console.error(err);
                }).finally(function() {
                    rl.close();
                });

            });
        },
        // CHEERIO ERROR TREATMENT
        console.error);

    }).catch(function(err) {
        // INPUT ERROR TREATMENT
        console.error(err.message);
        rl.close();
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
