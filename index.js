var asn = require("./asn"),
blocks = require("./blocks"),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync,
proc = process.argv;

console.log("==================");
console.log("Massive ASN blocks");
console.log("==================\n");

asn.init(function (page) {
  blocks.scrap(page, function (data) {
    for (var i = 0; i < data.length; i++) {
      var netblock = data[i][0], numIPs = data[i][1], args = [];
      console.log("\n");
      console.log(clc.blue(data[i][0]+"/"+data[i][1]));
      for (var i = 3; i < proc.length; i++) {
        args.push(proc[i]);
      }
      args.push(netblock+"/"+numIPs);
      console.log("command executed");
      console.log(proc[2]+" "+args);
      spawnSync(proc[2], args, {stdio:[0,1,2]});
    }
  });
});
