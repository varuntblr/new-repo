var http = require('http');
var fs = require('fs');
const {parse} = require('querystring');
var server = http.createServer((req, res) => {
    if(req.method === 'POST'){
        RequestData(req, result =>{
            res.end(`First Name: ${result.fname}, Last Name : ${result.lname}`);
        });
    }
    else{
            fs.readFile('file.html',function(err, data) {
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data);
                return res.end()
            });
    }
});
server.listen(3000);
function RequestData(request, callback){
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED){
        let body ='';
        request.on('data', chunk =>{
            body += chunk.toString();
        });
        request.on('end', ()=>{
            callback(parse(body));
        });
    }else{
        callback(null);
    }
}