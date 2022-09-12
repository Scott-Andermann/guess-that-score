const express = require("express");
const axios = require("axios");
const configKeys = require("../config/configKeys.json");
const config = require("../config/config.json")
const dummyData = require('../dummyData.json')
var W3CWebSocket = require("websocket").w3cwebsocket;

// Change to true for live data
let develop = false;    
if (config[process.env.NODE_ENV].port == 4000){
    develop = true;
}
let time = '5:00';

const client = new W3CWebSocket('ws://localhost:8080')

client.onerror = function(e) {
    console.log('connection error:', e)
}
client.onopen = function() {
    console.log('Websocket client connected');

    function sendTime() {
        client.send(JSON.stringify({type: 'timer', time: time}))
        console.log('sending current time: ', time)
        setTimeout(sendTime, 1000);
    }

    function sendGame() {
        client.send(JSON.stringify({type: 'gameData', game1: 'game', game2: 'game2'}))
        console.log('send updated game data')
        setTimeout(sendGame, 5000);
    }
    sendTime(time);
    sendGame();
}

const buildDate = () => {
    const monthNames =["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let date = new Date().toISOString().replace(/T/, ' ').slice(0,10)
    let month = Number(date.slice(5,7)) - 1 
    let returnDate = date.slice(0,5) + monthNames[month] + date.slice(7)
    // console.log('=========================');
    // console.log(returnDate);
    return returnDate;
}

const date = buildDate();
const key = process.env.KEY;
const keyConfig = configKeys[key];
let init = true;

const url = `https://api.sportsdata.io/v3/cfb/scores/json/GamesByDate/${date}?key=${keyConfig.key}`;

let gamesList = [];
let gameIndex = 5;

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

const updateData = async () => {
    // deal with no games playing on the front end
    // returns empty array if no games are playing
    gamesList = await getFacts();
}

// the following two functions serve a single random game for that day
const setGameIndex = () => {
    gameIndex = Math.floor(Math.random() * gamesList.length);
    // const JSON = {userName: 'user', message: 'message'}
    // client.send(JSON.stringify({type: 'message', userName: 'user', message: 'message'}))
}

const sendGame = (res) => {
    const game = gamesList[gameIndex]
    res.send([game])
}

module.exports = async (req, res) => {
    if (init) {
        gamesList = await getFacts();
        init = false;
    }
    setInterval(updateData, 300000);
    setInterval(setGameIndex, 3000);
    sendGame(res);
};
