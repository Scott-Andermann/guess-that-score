import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import apiClient from "./http-common";
import axios from "axios";
import Game from "./Game/Game";
import Socket from "./Socket/Socket";

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
  const [timer, setTimer] = useState(0);
  const [logos, setLogos] = useState(dummyTeams);


  return (
    <div className="App">
      <Socket setTimer={setTimer} setGameData={setGameData}/>
        {gameData.length > 0 ?
          gameData.map((game) => <Game key={game.gameID} game={game} logos={logos} />) :
          timer > 0 && <h2>The next game will begin soon</h2>}
          <h1>Time remaining in game: {timer} seconds</h1>
    </div>
  );
}

export default App;
