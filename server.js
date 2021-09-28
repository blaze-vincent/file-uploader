const PORT = 8080;

const http = require('http');
const fs = require('fs');

const server = http.createServer();

server.on('request', (req, res) => {
    switch(req.url){
        case '/':
            res.end(fs.readFileSync('index.html'));
        break;
    }
    return;
});


server.listen(PORT, _ => {console.log(`listening on port ${PORT}`)});