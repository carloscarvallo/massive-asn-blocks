#! /usr/bin/env node
var asn = require("./asn"),
blocks = require("./blocks"),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync,
notice = clc.blue,
proc = process.argv;

console.log(notice("\n=================="));
console.log(notice("Massive ASN blocks"));
console.log(notice("==================\n"));

asn(function (page) {
  if (proc[0].indexOf("node") != -1) {
    proc.splice(0, 1);
  }
  blocks(page, function (data) {
    for (var i = 2, args = []; i < proc.length; i++) {
      args.push(proc[i]);
    }
    for (var i = 0; i < data.length; i++) {
      var netblock = data[i][0], numIPs = data[i][1], com = "";
      args.push(netblock+"/"+numIPs);
      console.log(notice("\n++++++++++++++++++"));
      console.log(notice(" Command executed "));
      console.log(notice("++++++++++++++++++\n"));
      for (var i = 2; i < proc.length; i++) {
        if (i > 2) { com += " "+proc[i]; }
        else { com += proc[i]; }
      }
      if (proc.length == 2) { console.log(notice(proc[1], netblock+"/"+numIPs)+"\n"); }
      else { console.log(notice(proc[1], com+" "+netblock+"/"+numIPs)+"\n"); }
      spawnSync(proc[1], args, {stdio:[0,1,2]});
    }
  });
});
