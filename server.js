const PORT = 8080;

const http = require('http');
const fs = require('fs');

const server = http.createServer();
server.on('request', (req, res) => {
    switch(req.method){
        case 'GET':
            let destination;
            switch(req.url){ //basic routing
                case '/':
                    destination = 'public/index.html';
                break;
                default:
                    destination = `public${req.url}`;
                break;
            }
            try {
                res.statusCode = 200;
                res.end(fs.readFileSync(destination));
            } catch(err){
                res.statusCode = 404;
                res.statusMessage = 'not found';
                res.end()
            }
        break;
        case 'POST':
            switch(req.url){
                case '/upload':
                    if(!req.headers['file-name']){
                        res.statusCode = 400;
                        res.statusMessage = 'request missing file-name header';
                        res.end;
                        break;
                    }
                    const filePath = `uploads/${req.headers['file-name']}`;

                    if(fs.existsSync(filePath)){
                        res.statusCode = 200;
                    } else {
                        res.statusCode = 201;
                    }

                    req.on('data', chunk => {
                        fs.appendFileSync(filePath, chunk);
                    })
                    res.end('uploaded')
                break;
                default:
                    res.statusCode = 401;
                    res.statusMessage = 'POSTing not allowed on this route';
                    res.end();
                break;
                
            }
        break;
    }

});


server.listen(PORT, _ => {console.log(`listening on port ${PORT}`)});