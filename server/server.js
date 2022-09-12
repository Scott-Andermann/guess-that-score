const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const config = require("./config/config.json");
const middleware = require("./routes");


const env = process.env.NODE_ENV;
const configuration = config[env];


app.use(cors({origin: 'http://localhost:3000'}))
app.use("/data", middleware);

app.get("/", async (req, res) => {
  res.send(`port is: ${configuration.port}`);
});

app.get("*", (req, res) => {
  res.status(500).json({ message: "error" });
});

app.listen(configuration.port, () => {
  console.log(`Server running on port ${configuration.port}`);
});

