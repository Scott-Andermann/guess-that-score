import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import Game from "./Game/Game";
import Socket, { sendScoreToServer } from "./Socket/Socket";
import Score from "./Game/Score";

function App() {
  const [gameData, setGameData] = useState([]);
  const [userName, setUserName] = useState('Unknown');
  const [topUser, setTopUser] = useState('');
  const [timer, setTimer] = useState(0);
  const logos = dummyTeams;
  const [score, setScore] = useState(null);
  const [yourScore, setYourScore] = useState(null);
  const [yourBestScore, setYourBestScore] = useState(null);
  const [homeGuess, setHomeGuess] = useState(0);
  const [awayGuess, setAwayGuess] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const onClick = () => {
    let homeDiff = Math.abs(gameData[0].HomeTeamScore - homeGuess);
    let awayDiff = Math.abs(gameData[0].AwayTeamScore - awayGuess);
    let diff = homeDiff + awayDiff;
    if (diff < yourBestScore || yourBestScore === null) setYourBestScore(diff);
    sendScoreToServer({ userName: userName, score: diff })
    setYourScore(diff);
    setDisabled(true);
  }

  useEffect(() => {
    if (score === null) {
      setYourScore(null);
    }
  }, [score])


  return (
    <div className="App">
      <Socket setTimer={setTimer}
        setGameData={setGameData}
        setScore={setScore}
        setTopUser={setTopUser}
        setHomeGuess={setHomeGuess}
        setAwayGuess={setAwayGuess}
        setDisabled={setDisabled}
      />
      <h2>Enter User Name: </h2>
      <input value={userName} onChange={(e) => setUserName(e.target.value)}></input>
      {gameData.length > 0 ?
        gameData.map((game) => <Game key={game.gameID}
          game={game}
          logos={logos}
          homeGuess={homeGuess}
          setHomeGuess={setHomeGuess}
          awayGuess={awayGuess}
          setAwayGuess={setAwayGuess}
          yourScore={yourScore} />) :
        timer > 0 && <h2>The next round will begin soon</h2>}
      {gameData.length > 0 ? 
      <div>
        <button onClick={onClick} disabled={disabled}>Submit</button>
        <h1>Time remaining in round: {Math.round(timer)} seconds</h1>
        </div> : 
        <h1>Please come back later</h1>}
      <Score score={score} topUser={topUser} yourScore={yourScore} yourBestScore={yourBestScore} />
    </div>
  );
}

export default App;
