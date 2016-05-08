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
spawnSync = require('child_process').spawnSync,
CIDR = require('cidr-js'),
cidr = new CIDR(),
program = require('commander');

function printCommand ( command, args ) {
    
    var argsString = "";
    args.forEach(function( item, i ) {
        if ( i !== 0 ) {
            argsString += " " + item;
        } else {
            argsString += item;
        }
    });
    console.log(command, argsString);
    
}

function parseArgs ( command ) {
            
    var indexing = command.indexOf(" ");
    var comPrinc = command.substring(0, indexing);
    var comArgs = command.substring(indexing+1);
    return {
        princ : comPrinc,
        args : comArgs   
    }
 
}

program
    .version('2.0.0')
    .option('-c, --command <args>', 'Command to be executed', parseArgs);
    
    program.on('--help', function(){
    console.log('  Examples:');
    console.log('');
    console.log('    $ asn-blocks -c "nmap -n -P0 -vvv <ip>/<range>"');
    console.log('    $ asn-blocks -c "smbclient -L <ip> -U%"');
    console.log('');
    console.log('    Where <ip> or <range> where be replaced for the values of the choosen block');
    console.log('');
});

program.parse(process.argv);

var init = function () {
    scrap.asn(function ( ip, num ) {
        
        console.log('You are about to scan %s numbers of Ips\n', num);
        
        if ( /\//.test(ip) == true && /nmap/.test(program.command.princ) == false) {
            
            var results = cidr.list(ip);
            results.map(function(item, i) {
                
                var rep = program.command.args.replace(/<ip>/, item);
                var listArgs = rep.split(/\s/);
                
                printCommand(program.command.princ, listArgs);
                spawnSync(program.command.princ, listArgs, {stdio:[0,1,2]});
            });
            
        } else {
          
            var p = ip.indexOf("/");
            var IP = ip.substring(0, p);
            var range = ip.substring(p+1);
            
            var rep = program.command.args.replace(/<ip>/, IP);
            var args = rep.replace(/<range>/, range);
            var listArgs = args.split(/\s/);
            
            printCommand(program.command.princ, listArgs);
            spawnSync(program.command.princ, listArgs, {stdio:[0,1,2]});
            
        }  
    });
};

if (program.command.princ && program.command.args) {
    init();
} else {
    console.log('new error');
}