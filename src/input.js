const program = require('commander');

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

module.exports = {
    princ : program.command.princ,
    args : program.command.args,
    printCommand: function ( command, args ) {

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
}