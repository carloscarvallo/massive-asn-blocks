var asn = require("./asn"),
blocks = require("./blocks"),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync,
proc = process.argv;

console.log("\n==================");
console.log("Massive ASN blocks");
console.log("==================\n");

asn.init(function (page) {
  blocks.scrap(page, function (data) {
    for (var i = 0; i < data.length; i++) {
      var netblock = data[i][0], numIPs = data[i][1], args = [], com = "";
      console.log("\n");
      for (var i = 3; i < proc.length; i++) {
        args.push(proc[i]);
      }
      args.push(netblock+"/"+numIPs);
      console.log("++++++++++++++++");
      console.log("Command executed");
      console.log("++++++++++++++++\n");
      for (var i = 3; i < proc.length; i++) {
        if (i > 3) {
          com += " "+proc[i];
        } else {
          com += proc[i];
        }
      }
      if (proc.length == 3) { console.log(clc.blue(proc[2], netblock+"/"+numIPs)+"\n"); }
      else { console.log(clc.blue(proc[2], com+" "+netblock+"/"+numIPs)+"\n"); }
      spawnSync(proc[2], args, {stdio:[0,1,2]});
    }
  });
});
