const webSocketServer = require("websocket").server;
const http = require("http");
const cfb = require('cfb.js')
const { env } = require("process");
const configKeys = require("./config/configKeys.json"); // comment before deploying
// const dummyData = require('./dummyData.json')

const webSocketServerPort = process.env.PORT || 8080;

let keyConfig;

let develop = false;
if (webSocketServerPort == 8080) {
  const key = process.env.KEY; // comment before deploying
  keyConfig = configKeys[key]; // comment before deploying
  develop = true;
} else {
  keyConfig = { key: process.env.KEY }
}

//initiate websocket serer
const server = http.createServer();
server.listen(webSocketServerPort, () =>
  console.log(`Websocket listening on ${webSocketServerPort}`)
);

const wsServer = new webSocketServer({
  httpServer: server,
});

const defaultClient = cfb.ApiClient.instance;

const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
ApiKeyAuth.apiKey = `Bearer ${keyConfig.key}`;


var api = new cfb.GamesApi();

// need to automatically update the week/year

const conferences = ['American Athletic', 'Sun Belt', 'ACC', 'SEC', 'Mid-American', 'Conference USA', 'FBS Independents', 'Big 12', 'Big Ten', 'Pac-12', 'Mountain West']

const clients = {};
var users = {};
let time = 0;
let gameIndex = 0;
let score = null;
let topUser = '';
let gamesList;
let init = true;
let dataType;


const generateUniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + "-" + s4() + "-" + s4();
};

const setGameIndex = () => {
  gameIndex = Math.floor(Math.random() * gamesList.length);
  time = 20;
}

const getWeek = () => {
  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  var weekNumber = Math.ceil(days / 7);
  return (weekNumber - 35); // weeks into year will change based on when season starts
}

const buildJSON = (gameData) => {
  let result = []
  gameData.forEach(element => {
    obj = {
      id: element.id,
      period: 'Final',
      clock: null,
      homeTeam: {
        name: element.homeTeam,
        points: element.homePoints
      },
      awayTeam: {
        name: element.awayTeam,
        points: element.awayPoints
      }
    }
    result.push(obj);
  });

  return result;
}

const getFacts = async () => {
  try {
    // check if games are being played if yes, hit /scoreboard endpoint
    games = await api.getScoreboard({ classification: 'fbs' });
    currGames = games.filter(game => game.status !== 'scheduled');
    dataType = 'fresh';
    // if no games are being played, get last weeks games from /games endpoint with correct week number
    if (currGames.length === 0) {
      let year = new Date().getFullYear();
      let week = getWeek();
      let opts = {
        year: year,
        week: week
      }
      games = await api.getGames(year, opts);
      gameData = games.filter(game => conferences.includes(game.homeConference))
      result = buildJSON(gameData)
      dataType = 'stale';
      return result;
    }
    return currGames;

  } catch (e) {
    console.log("Error: ", e);
  }

};

const getGames = async () => {
  // console.log('updating from API')
  gamesList = await getFacts();
}

// push time to update to clients
setInterval(() => {
  if (init) {
    console.log('Initial pull from API')
    getGames();
    init = false;
  }
  Object.keys(clients).map((client) => {
    clients[client].send(JSON.stringify({ type: 'timer', time: time }));
  })
  Object.keys(clients).map((client) => {
    clients[client].send(JSON.stringify({ type: 'score', userName: topUser, score: score }));
  })
  time -= 0.5;
  
}, 500)

// push new game to clients
setInterval(() => {
  setGameIndex();
  if (gamesList.length === 0) {
    Object.keys(clients).map((client) => {
      clients[client].send(JSON.stringify({ type: 'gameData', dataType: dataType, game: [] }));
    })
  }
  Object.keys(clients).map((client) => {
    clients[client].send(JSON.stringify({ type: 'gameData', dataType: dataType, game: gamesList[gameIndex] }));
  })
  time = 19;
  score = null;
  topUser = '';
}, 21000)

// update game data via API endpoint
setInterval(async () => {
  // console.log('updating from API')
  gamesList = await getFacts();
}, 30000)

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

  connection.on('message', function (message) {
    try {
      parsed = JSON.parse(message.utf8Data);
      if (parsed.type === 'score') {
        // console.log(parsed.score);
        if (score === null || score > parsed.score) {
          score = parsed.score;
          topUser = parsed.userName
        }
      }
    } catch (e) {
      console.log('There was something wrong with the message: ' + e);
    }
  })

  connection.on("close", function (connection) {
    console.log(new Date() + " Peer " + userID + " disconnected.");
    delete clients[userID];
    delete users[userID];
    const jsonEvent = { type: "user_event" };
  });
});