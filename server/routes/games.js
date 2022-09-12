const express = require("express");
const axios = require("axios");
const configKeys = require("../config/configKeys.json");
const config = require("../config/config.json")
const dummyData = require('../dummyData.json')

// Change to true for live data
let develop = false;    
if (config[process.env.NODE_ENV].port == 4000){
    develop = true;
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

let facts = [];

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
    // deal with no games playin on the front end
    facts = await getFacts();
}

module.exports = async (req, res) => {
    if (init) {
        facts = await getFacts();
        init = false;
    }
    setInterval(updateData, 300000);
    res.send(facts);
};
