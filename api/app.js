var http = require('http');
var fs = require('fs');
http.createServer(function(req, res){
    var {method} = req;
    fs.readFile('./hello.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);

        if(method == 'GET')
        {
            console.log('method is GET');
            res.write('<br>Method used is GET');
            
        }
        else if(method == 'POST')
        {
            console.log('method is POST');
            res.write('<br>Method used is POST');
        }
        res.end();
    });

}).listen(3000);