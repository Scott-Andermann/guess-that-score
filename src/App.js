import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import apiClient from "./http-common";
import axios from "axios";
import Game from "./Game/Game";

const key = process.env.REACT_APP_API_KEY;
const develop = process.env.REACT_APP_DEVELOP;

const config ={
headers: {
  'Access-Control-Allow-Credentials':true,
  'Access-Control-Allow-Origin':'https://localhost:4000',
}
}

function App() {
  const [gameData, setGameData] = useState([]);
  const [logos, setLogos] = useState([]);

  const fetchGameData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/data/games`, config);
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
    if (!develop) {
      fetchLogos();
    } else setLogos(dummyTeams)
    fetchGameData();
  }, []);
  // console.log("=========================");
  // console.log(logos);
  // console.log("=========================");

  return (
    <div className="App">
      {gameData.length > 0 &&
        gameData.map((game) => <Game game={game} logos={logos} />)}
    </div>
  );
}

export default App;
