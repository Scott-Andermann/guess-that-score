import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import apiClient from "./http-common";
import axios from "axios";
import Game from "./Game/Game";
import Socket, {sendScoreToServer} from "./Socket/Socket";
import Score from "./Game/Score";

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
  const [userName, setUserName] = useState('Unknown');
  const [topUser, setTopUser] = useState('');
  const [timer, setTimer] = useState(0);
  const [logos, setLogos] = useState(dummyTeams);
  const [score, setScore] = useState(null);
  const [yourScore, setYourScore] = useState(null);
  const [yourBestScore, setYourBestScore] = useState(null);
  const [homeGuess, setHomeGuess] = useState(0);
  const [awayGuess, setAwayGuess] = useState(0);

  const onClick = () => {
    let homeDiff = Math.abs(gameData[0].HomeTeamScore - homeGuess);
    let awayDiff = Math.abs(gameData[0].AwayTeamScore - awayGuess);
    let diff = homeDiff + awayDiff;
    setHomeGuess(0);
    setAwayGuess(0);
    if (diff < yourBestScore || yourBestScore === null) setYourBestScore(diff);
    sendScoreToServer({userName: userName, score: diff})
    setYourScore(diff);
  }

  useEffect(() => {
    if (score === null) {
      setYourScore(null);
    }
  }, [score])


  return (
    <div className="App">
      <Socket setTimer={setTimer} setGameData={setGameData} setScore={setScore} setTopUser={setTopUser}/>
      <h2>Enter User Name: </h2>
      <input value={userName} onChange={(e) => setUserName(e.target.value)}></input>
        {gameData.length > 0 ?
          gameData.map((game) => <Game key={game.gameID} 
          game={game} 
          logos={logos}
          homeGuess={homeGuess}
          setHomeGuess={setHomeGuess}
          awayGuess={awayGuess}
          setAwayGuess={setAwayGuess} />) :
          timer > 0 && <h2>The next game will begin soon</h2>}
      <button onClick={onClick}>Submit</button>
          <h1>Time remaining in game: {timer} seconds</h1>
      <Score score={score} topUser={topUser} yourScore={yourScore} yourBestScore={yourBestScore} />
    </div>
  );
}

export default App;
