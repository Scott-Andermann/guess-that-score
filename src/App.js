import { useState, useEffect } from "react";
import "./App.css";
import dummyTeams from './dummyTeams.json';
import Socket, { sendScoreToServer } from "./Socket/Socket";
import Score from "./Score/Score";
import Timer from "./Timer/Timer";
import TeamElement from "./TeamElement/TeamElement";
import TimeRemaining from "./TimeRemaining/TimeRemaining";
import TitleImage from "./TitleImage/TitleImage";

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
      <h2 className='team-name'>Enter your Username: </h2>
      <input className='username-input' value={userName} onChange={(e) => setUserName(e.target.value)} tabIndex='1'></input>

      <div className="scoreboard-container">

        <div className='scoreboard-wrapper'>
          {gameData && gameData !== 'none' && 
            <TeamElement game={gameData} logo={awayLogo} homeAway={false} guess={awayGuess} setGuess={setAwayGuess} yourScore={yourScore} disabled={disabled} />
          }
          <div className='title-wrapper'>
            <TitleImage />
            {gameData && gameData !== 'none' &&
              <div>
                <Timer timer={timer} />
                <TimeRemaining gameData={gameData} />
                <button onClick={onClick} disabled={disabled} tabIndex='4' className='submit-button'>Submit Guesses</button>
              </div>
              }
          </div>
          {gameData && gameData !== 'none' && 
            <TeamElement game={gameData} logo={homeLogo} homeAway={true} guess={homeGuess} setGuess={setHomeGuess} yourScore={yourScore} disabled={disabled} />
          }
        </div>
      </div>
      <Score score={score} topUser={topUser} yourScore={yourScore} yourBestScore={yourBestScore} />
    </div>
  );
}

export default App;
