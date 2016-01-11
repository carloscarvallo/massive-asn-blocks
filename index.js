var asn = require("./asn"),
blocks = require("./blocks"),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync;

console.log("=================\n");
console.log("Massive ASN blocks\n");
console.log("=================\n\n");

asn.init(function (page) {
  blocks.scrap(page, function (data) {
    for (var i = 0; i < data.length; i++) {
      var netblock = data[i][0], numIPs = data[i][1];
      console.log("\n");
      console.log(clc.blue(data[i][0]+"/"+data[i][1]));
      child = spawnSync('nmap', ['-n', '-P0', '-vvv', netblock+"/"+numIPs], {stdio:[0,1,2]});
    }
  });
});
