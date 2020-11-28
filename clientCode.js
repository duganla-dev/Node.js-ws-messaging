var sender = document.getElementById('sendMsg_from').value;
var user = { 'id': sender };


function addMessage(sender, content, color) {
	if (color === undefined) {
	document.getElementById('messages').innerHTML += `<div><b>${sender}</b><p>${content}</p></div>`;
	} else {
	document.getElementById('messages').innerHTML += `<div><b style="color:${color.name}"}>${sender}</b><p style="color:${color.content}">${content}</p></div>`;
	}
};


// User 'wss' and not 'ws' if TLS encrypted encrypted TLS connection
 socket = new WebSocket('ws://localhost:5069');
try {
	socket.onopen = function () {
  var payload = { 'type': 'connect' };
		socket.send(JSON.stringify(payload))
	};
} catch (e) {
	addMessage('CLIENT', e);
}

socket.onerror = function (data) {
	addMessage('CLIENT', 'There was an error with your websocket', { 'name': 'green', 'content': 'red' })
};

socket.onclose = function (data) {
	var why;
  if (data.code == 1006) {
		why = "Can't establish a connection to Websocket"
	} else if (data.code == 1000) {
  	why = 'Websocket connection closeed'
	} else {
  	why = 'Unknown'
	};
  addMessage('CLIENT', why, { 'name': 'green', 'content': 'red' })
};

socket.onmessage = function (data) {
	data = JSON.parse(data.data);
  console.log(data);
  if (data.type == 'connect') {
		addMessage('CLIENT', data.message, { 'name': 'green', 'content': 'black' })
	};
	
	if (data.type == 'message') {
  	if (data.status == 'error') {
    	addMessage('SERVER', data.message, { 'name': 'red', 'content': 'black' })
		} else if (data.status == 'receave') {
			addMessage(data.message.sender, data.message.content)
		}
	}
};

function sendMessage() {
	var to = document.getElementById('sendMsg_to').value;
  if (to) {
		payload = {
    	'type': 'message',
    	'user': user,
    	'message': { 'status': 'send', 'sender': user.id, 'to': to, 'content': document.getElementById('sendMsg_msg').value }
    };
		socket.send(JSON.stringify(payload))
		} else {
			document.getElementById('send-error').innerHTML = 'To Username Not Set'
	}
};
