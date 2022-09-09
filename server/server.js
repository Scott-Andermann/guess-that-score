const { default: axios } = require('axios')
const express = require('express')
const app = express()
const config = require('./config/config.json')
const middleware = require('./routes');

const env = process.env.NODE_ENV
const configuration = config[env]

app.use("/cat", middleware);

app.get("/", async (req, res) => {
    // try {
    //     axios.get("https://api.neoscan.io/api/main_net/v1/get_all_nodes")
    //     .then(data => res.status(200).send(data))
    //     .catch(err => res.send(err));
    // }
    // catch (err) {
    //     console.log(err)
    // }
    res.send(`port is: ${configuration.port}`);
})

app.get('*', (req, res) => {
    res.status(500).json({ message: "error" })
})

  app.listen(configuration.port, () => {
    console.log(`Server running on port ${configuration.port}`)
  })