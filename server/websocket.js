const webSocketServer = require("websocket").server;
const http = require("http");
const { env } = require("process");
const webSocketServerPort = process.env.PORT || 8000;

const server = http.createServer();
server.listen(webSocketServerPort, () =>
  console.log(`Websocket listening on ${webSocketServerPort}`)
);

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};
var users = {};

const generateUniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + "-" + s4() + "-" + s4();
};

const sendMessage = (json) => {
  Object.keys(clients).map((client) => {
    clients[client].sendUTF(json);
  });
};

const typesDef = {
  USER_EVENT: "userevent",
  CONTENT_CHANGE: "contentchange",
};

wsServer.on("request", function (request) {
  var userID = generateUniqueId();

  console.log(
    new Date() + " Received new connection from origin " + request.origin
  );

  const connection = request.accept(null, request.origin);

  clients[userID] = connection;
  users[userID] = 'Unknown'
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );

  connection.on("message", function (message) {
    console.log(users);
    // console.log(connection)
    // console.log("this is a server message");
    try {
      parsed = JSON.parse(message.utf8Data);
      if (parsed.type === 'message') {
        console.log(userID + " " + parsed.userName + " " + parsed.message);
        Object.keys(clients).map((client) => {
          clients[client].send(JSON.stringify({type: 'chat', post: parsed.userName + ': ' + parsed.message}));
        });
      } else if (parsed.type === 'userUpdate') {
        console.log(parsed.userName);
      // update user list with new name
        users[userID] = parsed.userName;
        const userList = [];
        Object.keys(users).map(key => userList.push(users[key]))
        Object.keys(clients).map((client) => {
          clients[client].send(JSON.stringify({type: 'user', users: userList}));
        })
      }

    } catch (e) {
      console.log('There was something wrong with the message: ' + e)
    }
  });

  connection.on("close", function (connection) {
    console.log(new Date() + " Peer " + userID + " disconnected.");
    delete clients[userID];
    delete users[userID];
    const jsonEvent = { type: "user_event" };
  });
});