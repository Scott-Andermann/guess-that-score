import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import Socket, { sendScoreToServer } from "./Socket/Socket";
import Score from "./Game/Score";
import Timer from "./Timer/Timer";
import TeamElement from "./Game/TeamElement";
import TimeRemaining from "./Game/TimeRemaining";

function App() {
  const [gameData, setGameData] = useState('none');
  const [userName, setUserName] = useState('Unknown');
  const [topUser, setTopUser] = useState('');
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(null);
  const [yourScore, setYourScore] = useState(null);
  const [yourBestScore, setYourBestScore] = useState(null);
  const [homeGuess, setHomeGuess] = useState(0);
  const [awayGuess, setAwayGuess] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const logos = dummyTeams;
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");

  useEffect(() => {
    const getLogo = (id) => {
      const team = logos.find((logo) => logo.TeamID === id);
      const url = team.TeamLogoUrl;
      return url;
    };
    if (gameData !== 'none') {
      setHomeLogo(getLogo(gameData.HomeTeamID));
      setAwayLogo(getLogo(gameData.AwayTeamID));
    }
  }, [logos, gameData]);

  const onClick = () => {
    let homeDiff = Math.abs(gameData.HomeTeamScore - homeGuess);
    let awayDiff = Math.abs(gameData.AwayTeamScore - awayGuess);
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


      <div className='scoreboard-wrapper'>
        {gameData && gameData !== 'none' && <TeamElement game={gameData} logo={awayLogo} homeAway={false} guess={awayGuess} setGuess={setAwayGuess} yourScore={yourScore} />}
        <div>
          {gameData && gameData !== 'none' &&
            <div>
              <button onClick={onClick} disabled={disabled}>Submit</button>
              <Timer timer={timer} />
              <TimeRemaining gameData={gameData} />
            </div>}
          <div className='title'>
            <img src="https://fontmeme.com/permalink/220913/63d5c628d0c6d9378952753d2843c49f.png" alt="the-price-is-right-font https://fontmeme.com/the-price-is-right-font/" border="0" />
            <img src="https://fontmeme.com/permalink/220913/90d0faa40143d7b35c3911f77e7ca65b.png" alt="the-price-is-right-font https://fontmeme.com/the-price-is-right-font/" border="0" />
            <img src="https://fontmeme.com/permalink/220913/106ac778456e67f8595b2ee386c440f8.png" alt="the-price-is-right-font https://fontmeme.com/the-price-is-right-font/" border="0" />
          </div>
        </div>
        {gameData && gameData !== 'none' && <TeamElement game={gameData} logo={homeLogo} homeAway={true} guess={homeGuess} setGuess={setHomeGuess} yourScore={yourScore} />}
      </div>


      {/* {gameData && gameData !== 'none' ?
        <Game key={gameData.gameID}
          game={gameData}
          logos={logos}
          homeGuess={homeGuess}
          setHomeGuess={setHomeGuess}
          awayGuess={awayGuess}
          setAwayGuess={setAwayGuess}
          yourScore={yourScore} /> :
        timer > 0 && <h2>The next round will begin soon</h2>} */}
      <Score score={score} topUser={topUser} yourScore={yourScore} yourBestScore={yourBestScore} />
    </div>
  );
}

export default App;
