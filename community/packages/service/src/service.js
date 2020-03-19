const http = require('http');
const https = require('https');

const token = "AOjzidJpRvmfn9Y92xg6-wA";
const spaces = {
    "offers": "vKfohF7J",
    "requests": "97yYVnAy"
};


module.exports = function Server(port) {
    console.log('Start http server');
    this.server = http.createServer().listen(port);
    this.server.on('request', (req, response) => {
        let props = [];
        req.on('data', (chunk) => {
            props.push(chunk);
        }).on('end', () => {
            props = Buffer.concat(props).toString();
            let propsObj = JSON.parse(props);
            console.log(propsObj, 'ss')
        });
    });

    this.port = port;

    this.close = ()=>this.server.close();
}

