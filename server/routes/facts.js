const express = require('express');
const axios = require('axios');

const getFacts = async () => {
    const response = await axios(`https://catfact.ninja/fact`);
    return response;
};

module.exports = async (req, res) => {
    let responseFact = await getFacts();
    res.send(responseFact.data.fact);
}