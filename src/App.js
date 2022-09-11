import { useState, useEffect } from "react";
import "./App.css";
import apiClient from "./http-common";
import Game from "./Game/Game";

const date = "2022-SEP-03";
const key = process.env.REACT_APP_API_KEY;

const url = `https://api.sportsdata.io/v3/cfb/scores/json/GamesByDate/${date}?key=${key}`;

function App() {
  const [gameData, setGameData] = useState([]);
  const [logos, setLogos] = useState([]);

  const fetchGameData = async () => {
    try {
      const response = await apiClient.get(`/GamesByDate/${date}?key=${key}`);
      setGameData(response.data);
    } catch (e) {
      console.log("=========================");
      console.log(e);
      console.log("=========================");
    }
  };

  const fetchLogos = async () => {
    try {
      const response = await apiClient.get(`/Teams?key=${key}`);
      setLogos(response.data);
    } catch (e) {
      console.log("=========================");
      console.log(e);
      console.log("=========================");
    }
  };

  useEffect(() => {
    fetchLogos();
    fetchGameData();
  }, []);
  console.log("=========================");
  console.log(logos);
  console.log("=========================");

  return (
    <div className="App">
      {gameData.length > 0 &&
        gameData.map((game) => <Game game={game} logos={logos} />)}
    </div>
  );
}

export default App;
