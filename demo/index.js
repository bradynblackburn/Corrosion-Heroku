const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer();
const Corrosion = require('../');
const proxy = new Corrosion({
    codec: 'xor',
    prefix: '/c/',
    forceHttps: true
});

proxy.bundleScripts();
console.log('Server is running on port ' + (process.env.PORT || 5000))
console.log('Corrosion-Heroku upgraded by Bradyn B.')
console.log('Alloy Proxy Successor.')
console.log('                                              ')
server.on('request', (request, response) => {
    if (request.url.startsWith(proxy.prefix)) return proxy.request(request, response);
    let html = fs.readFileSync(__dirname + '/index.html', 'utf-8');
    html = html.replace('{{PROXY_CREATOR}}', process.env.PROXY_CREATOR || 'Unknown');
    html = html.replace('{{PROXY_UPGRADER}}', process.env.PROXY_UPGRADER || 'Unknown');
    response.end(html);
}).on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead)).listen(process.env.PORT || 5000);