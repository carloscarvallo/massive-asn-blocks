const readline      = require('readline'),
      cheerio       = require('cheerio'),
      rp            = require('request-promise'),
      ipinfo        = require('../providers/ipinfo'),
      fs            = require('fs'),
      rl            = readline.createInterface(process.stdin, process.stdout);

function writeToFile ( data, dir ) {
    var obj = JSON.stringify(data);
    fs.writeFile( dir.toLowerCase() + '.json', obj, (err) => {
        if (err) console.error(err);
        console.log('\nIt\'s saved!');
    });
}

var getInput = function () {
  var promise = new Promise(function( resolve, reject ) {
      rl.question("Type the ISO code of the country (ex. PY Paraguay, AR Argentina): ", function( resp ) {
          if (resp) {
              resolve(resp.toLowerCase());
          } else {
              reject(new Error('country needed!'));
          }
      });
  });
  return promise;
};

var asnScrap = function ( callback ) {
    getInput().then(function ( input ) {

        var options = {
            uri: ipinfo.url+'countries/'+input,
            transform: function(body) {
                return cheerio.load(body);
            }
        };

        rp( options )
        .then(function( $ ) {

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
        .catch(function( err ) {
            // TODO: Request error treatment
            console.error(err);
        })
        .then(function( block ) {

            block.map(function( item, index ){
                console.log('%s. %s %s', index+1, block[index][0], block[index][1]);
            });

            var reqAsn = 0;
            rl.question("Enter the number of the ASN do you want to scan : ", function( reqip ) {
                
                if (!reqip) {
                    console.log('');
                    console.log('you must enter a ASN number!');
                    console.log('');
                }
                
                var asn = {};
                // Name of the ASN
                reqAsn = block[reqip-1][0];
                var namAsn = block[reqip-1][1];
                asn.name = namAsn;
                asn.dir = reqAsn;
                asn.netBlocks = [];
                console.log(asn.name, asn.dir);

                var options = {
                    uri: ipinfo.url+reqAsn,
                    transform: function(body) {
                        return cheerio.load(body);
                    }
                };

                rp( options )
                .then(function( $ ) {
                    
                    var blocks = [], 
                        numIps = [],
                        ip;
                        
                    $('#block-table tr td').each(function() {
                        ip = $(this).next().prev().prev().text();
                        cant = $(this).next().next().text();
                            if ( ip !== "" ) {
                                blocks.push(ip);
                            }
                            if ( cant !== "" ) {
                                numIps.push(cant);
                            }
                    });
                    
                    blocks.forEach(function( item, i ) {
                        asn.netBlocks.push( { _id: i+1, dir: item, num: numIps[i] } );
                    });
                    
                    return asn;
                })
                .catch(function( err ) {
                    // TODO: Request error treatment
                    console.error(err);
                })
                .then(function( asn ) {
                    
                    writeToFile(asn, asn.dir);
                    /*
                    @Object asn:
                    
                    { name: 'Telecel S.A.',
                      dir: 'AS23201',
                      netBlocks: 
                        [ { _id: 1, dir: '181.40.0.0/16', num: '65,536' },
                        { _id: 2, dir: '181.40.0.0/18', num: '16,384' },
                        { _id: 3, dir: '181.40.0.0/19', num: '8,192' },
                        { _id: 4, dir: '181.40.0.0/20', num: '4,096' },
                        { _id: 5, dir: '181.40.7.0/24', num: '256' },
                        { _id: 6, dir: '181.40.16.0/20', num: '4,096' },
                        { _id: 7, dir: '181.40.16.0/24', num: '256' },
                        { _id: 8, dir: '181.40.46.0/24', num: '256' },
                    */ 
                    
                    asn.netBlocks.forEach(function ( item, i ) {
                        console.log("%s. %s %s", asn.netBlocks[i]._id, asn.netBlocks[i].dir, asn.netBlocks[i].num);
                    });
                    
                    rl.question("Choose a netBlock from " + asn.name +" "+ asn.dir +" : ", function( resp ){
                        
                        if (!resp) {
                            console.log('');
                            console.log('you must choose a netBlock!');
                            console.log('');
                        }
                        
                        callback( asn.netBlocks[resp - 1].dir, asn.netBlocks[resp - 1].num );
                        rl.close();
                    });
                });
                
            });
        }).catch(function( err ) {
            // TODO: Cheerior error treatment
            console.error(err);
        });

    }).catch(function( err ) {
        // TODO: Input error treatment
        console.error(err.message);
        asnScrap();
    });
};

exports.asn = asnScrap;
