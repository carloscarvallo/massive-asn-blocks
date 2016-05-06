#! /usr/bin/env node

/* @source: https://github.com/carloscarvallo/massive-asn-blocks
   Copyright (C) 2015-2016  Carlos Carvallo

The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source. */

const scrap = require('./src/ipinfo-scrap'),
clc = require('cli-color'),
spawnSync = require('child_process').spawnSync,
CIDR = require('cidr-js'),
cidr = new CIDR(),
notice = clc.blue;

var command = process.argv[2];

var printCommand = function ( command, args ) {
    var argsString = "";
    args.forEach(function( item, i ) {
        if ( i !== 0 ) {
            argsString += " " + item;
        } else {
            argsString += item;
        }
    });
    console.log(command, argsString);
};

if (command) {
    init();
} else {
    console.error('ep');
    process.exit();
}

function init () {
    scrap.asn(function (ip, num) {
        
        var indexPrimerEspacio = command.indexOf(" ");
        var comandoPrincipal = command.substring(0, indexPrimerEspacio);
        var argumentosDelComando = command.substring(indexPrimerEspacio+1);
        
        console.log('You are about to scan %s numbers of Ips\n', num);
        
        if ( /\//.test(ip) == true && /nmap/.test(comandoPrincipal) == false) {
            
            var results = cidr.list(ip);
            results.map(function(item, i) {
                
                var rep = argumentosDelComando.replace(/<ip>/, item);
                var listArgs = rep.split(/\s/);
                
                printCommand(comandoPrincipal, listArgs);
                //spawnSync(comandoPrincipal, listArgs, {stdio:[0,1,2]});
            });
            
        } else {
          
            var p = ip.indexOf("/");
            var IP = ip.substring(0, p);
            var range = ip.substring(p+1);
            
            var rep = argumentosDelComando.replace(/<ip>/, IP);
            var args = rep.replace(/<range>/, range);
            var listArgs = args.split(/\s/);
            
            printCommand(comandoPrincipal, listArgs);
            //spawnSync(comandoPrincipal, listArgs, {stdio:[0,1,2]});
            
        }  
    });
}