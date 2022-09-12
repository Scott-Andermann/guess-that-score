const webSocketServer = require("websocket").server;
const http = require("http");
const axios = require("axios");
const { env } = require("process");
const configKeys = require("./config/configKeys.json");
const config = require("./config/config.json")
const dummyData = require('./dummyData.json')

const webSocketServerPort = process.env.PORT || 8080;

let develop = false;    
if (webSocketServerPort == 8080){
    develop = true;
}

//initiate websocket serer
const server = http.createServer();
server.listen(webSocketServerPort, () =>
  console.log(`Websocket listening on ${webSocketServerPort}`)
);

const wsServer = new webSocketServer({
  httpServer: server,
});

// create date string in proper format
const buildDate = () => {
  const monthNames =["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  let date = new Date().toISOString().replace(/T/, ' ').slice(0,10)
  let month = Number(date.slice(5,7)) - 1 
  let returnDate = date.slice(0,5) + monthNames[month] + date.slice(7)
  return returnDate;
}

const date = buildDate();
const key = process.env.KEY;
const keyConfig = configKeys[key];
let init = true;

const url = `https://api.sportsdata.io/v3/cfb/scores/json/GamesByDate/${date}?key=${keyConfig.key}`;

const clients = {};
var users = {};
let time = 0;
let gameIndex = 0;
let gamesList = [];

const setGameIndex = () => {
  gameIndex = Math.floor(Math.random() * gamesList.length);
  time = 20;
}

const generateUniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + "-" + s4() + "-" + s4();
};

const getFacts = async () => {
    
  if (!develop) {
      try {
          const response = await axios(url);
          console.log("response succeeded");
          return response.data;
          // return callResponse;
      } catch (e) {
          console.log("Error: ", e);
      }
  }
  else {
      return dummyData;
  }
};

// push time to update to clients
setInterval(() => {
  Object.keys(clients).map((client) => {
    clients[client].send(JSON.stringify({type: 'timer', time: time}));
  })
  time -= 1;
}, 1000)

// push new game to clients
setInterval(() => {
  setGameIndex();
  Object.keys(clients).map((client) => {
    clients[client].send(JSON.stringify({type: 'gameData', game: gamesList[gameIndex]}));
  })
  time = 4;
}, 5000)

// update game data via API endpoint
setInterval(async () => {
  console.log('updating from API')
  gamesList = await getFacts();
}, 10000)

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

  // connection.on("message", function (message) {
  //   try {
  //     parsed = JSON.parse(message.utf8Data);
  //     if (parsed.type === 'timer') {
  //       console.log(parsed.time);
  //       Object.keys(clients).map((client) => {
  //         clients[client].send(JSON.stringify({type: 'timer', post: parsed.time}));
  //       });
  //     } else if (parsed.type === 'gameData') {
  //       console.log(parsed.game.AwayTeam);
  //       Object.keys(clients).map((client) => {
  //         clients[client].send(JSON.stringify({type: 'gameData', game: parsed.game}));
  //       })
  //     }

  //   } catch (e) {
  //     console.log('There was something wrong with the message: ' + e)
  //   }
  // });

  connection.on("close", function (connection) {
    console.log(new Date() + " Peer " + userID + " disconnected.");
    delete clients[userID];
    delete users[userID];
    const jsonEvent = { type: "user_event" };
  });
});