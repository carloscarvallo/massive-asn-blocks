var jsonHttp = require('json-http');
var fs = require('fs');

jsonHttp.getJson('http://ipinfo.io/json', function(err, response){
  
  var res = response.org, pos = res.indexOf(" "), org = res.substring(0, pos);
  
  fs.writeFile( org +'.txt', org, function(err) {
  if (err)
    console.log(err);
  else
    console.log('Operacion completada');
  });  
});


