const PORT = 8080;

const http = require('http');
const fs = require('fs');

const server = http.createServer();

server.on('request', (req, res) => {
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
        res.end(fs.readFileSync(destination));
    } catch(err){
        res.statusCode = 404;
        res.statusMessage = 'not found';
        res.end()
    }
});


server.listen(PORT, _ => {console.log(`listening on port ${PORT}`)});