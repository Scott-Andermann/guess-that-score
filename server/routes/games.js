const express = require("express");
const axios = require("axios");

// const key = "?key=f20f8f675eeb4d6ba5c4bc93e89c4ad2";
const date = "2022-SEP-03";
const SPORTS_API_KEY = process.env.SPORTS_DATA_KEY;

const url = `https://api.sportsdata.io/v3/cfb/scores/json/Teams?key=f20f8f675eeb4d6ba5c4bc93e89c4ad2`;

const getFacts = async () => {
  try {
    const response = await axios(url);
    console.log("response succeeded");
    console.log(SPORTS_API_KEY);
    return response.data;
    // return callResponse;
  } catch (e) {
    console.log("Error: ", e);
  }
};

module.exports = async (req, res) => {
  let responseFact = await getFacts();
  res.send(responseFact);
};