var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var messages = [];
var topic = '"Not currently set"';
console.log('websockets server started');

ws.on('connection', function(socket) {
  console.log('client connection established');

  // inform the new user of the current topic
  if (topic) {
    socket.send('*** Topic is ' + topic);
  }

  // send history of all messages
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on('message', function(data) {
    console.log('message received: ' + data);

    // check to see if user input a command
    if (data.charAt(0) === '/') {

      //check to see if command was valid

      // '/topic' sets a new chat room topic and informs all currently connected
      // users of the change
      if (data.split(' ')[0] == '/topic') {
        topic = '"' + data.substr(7) + '"';
        data = '*** Topic has changed to ' + topic;
      } else {
        data = 'unknown command "' + data.split(' ')[0] + '"';
      }
    }
    // if no command was input, then user was sending a message
    else {
      messages.push(data);
    }

    // send the message to every connect user
    ws.clients.forEach(function(clientSocket) {
      clientSocket.send(data);
    });

  });
});
