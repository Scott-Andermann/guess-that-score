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
let time = 0;

const client = new W3CWebSocket('ws://localhost:8080')


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
    console.log('updating data from API')
    gamesList = await getFacts();
    
}

// the following two functions serve a single random game for that day


const sendGame = (res) => {
    const game = gamesList[gameIndex]
    res.send([game])
}

client.onerror = function(e) {
    console.log('connection error:', e)
}
client.onopen = function() {
    console.log('Websocket client connected');

    function setGameIndex() {
        gameIndex = Math.floor(Math.random() * gamesList.length);
        time = 20;
        setTimeout(setGameIndex, 20000)
    }   
    

    function sendTime() {
        client.send(JSON.stringify({type: 'timer', time: time}))
        time -= 1;
        console.log('sending current time: ', time)
        setTimeout(sendTime, 1000);
    }

    function sendGame() {
        // console.log(gamesList)
        client.send(JSON.stringify({type: 'gameData', game: gamesList[gameIndex]}))
        console.log('send updated game data')
        setTimeout(sendGame, 20000);
    }



    setGameIndex();
    sendTime(); // update time remaining every second (20 second reset)
    sendGame(); // update game displayed every 20 seconds
}

module.exports = async (req, res) => {
    if (init) {
        gamesList = await getFacts();
        init = false;
    }
    // setInterval(updateData, 30000);
    // setInterval(setGameIndex, 3000);
    sendGame(res);
};
