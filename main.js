const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5069 });

console.log("Started Server ");

var clients = {};

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        data = JSON.parse(data);
        console.log(data);

        if (data['user']) {
            clients[data.user.id] = ws;
        };

        if (data.type == 'connect') {
            ws.send(JSON.stringify({ 'type': 'connect', 'message': 'Connection Established'}))
        };

        if (data.type == 'message') {
            if (data.message.sender && data.message.to) {
                if (data.message.status == 'send' && clients[data.message.to] ) {
                    var payload = {
                        'type': 'message',
                        'status': 'receave',
                        'message': { 'sender': data.message.sender, 'to': data.message.to, 'content': data.message.content }
                    }
                    clients[data.message.to].send(JSON.stringify(payload));
                    ws.send(JSON.stringify(payload));
                } else {
                    ws.send(JSON.stringify({ 'type': 'message', 'status': 'error', 'message': 'User Not Found' }))
                };
            } else {
                ws.send(JSON.stringify({ 'type': 'message', 'status': 'error', 'message': 'Missing Sender or Recipients' }))
            }
        };

    });
});


