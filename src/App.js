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
  // const [topUser, setTopUser] = useState('');
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState([]);
  const [yourScore, setYourScore] = useState(null);
  const [yourBestScore, setYourBestScore] = useState(null);
  const [homeGuess, setHomeGuess] = useState(0);
  const [awayGuess, setAwayGuess] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const logos = dummyTeams;
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");
  const [dataType, setDataType] = useState('stale');

  const getWeek = () => {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    let weekNumber = Math.ceil(days / 7);
    return (weekNumber - 35); // weeks into year will change based on when season starts
  }

  useEffect(() => {
    const getLogo = (school) => {
      let url;
      try {
        let team
        if (dataType === 'fresh') {
          team = logos.find((logo) => school.includes(logo.Name) && school.includes(logo.School));
        } else {
          team = logos.find((logo) => logo.School === school);
        }
        url = team.TeamLogoUrl;
      } catch (e) {
        console.log('Error: ', e)
        url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/NCAA_logo.svg/117px-NCAA_logo.svg.png?20171117030529'
      }
      return url;
    };
    if (gameData !== 'none') {
      setHomeLogo(getLogo(gameData.homeTeam.name));
      setAwayLogo(getLogo(gameData.awayTeam.name));
    }
  }, [logos, gameData, dataType]);

  const onClick = () => {
    let homeDiff = Math.abs(gameData.homeTeam.points - homeGuess);
    let awayDiff = Math.abs(gameData.awayTeam.points - awayGuess);
    let diff = homeDiff + awayDiff;
    if (diff < yourBestScore || yourBestScore === null) setYourBestScore(diff);
    sendScoreToServer({ userName: userName, score: diff })
    setYourScore(diff);
    setDisabled(true);
  }

  const userNameChange = (e) => {
    if (e.target.value.length < 12) {
      setUserName(e.target.value)
    }
  }

  useEffect(() => {
    if (score.length === 0) {
      setYourScore(null);
    }
  }, [score])

  return (
    <div className="App">
      <Socket setTimer={setTimer}
        setGameData={setGameData}
        setScore={setScore}
        // setTopUser={setTopUser}
        setHomeGuess={setHomeGuess}
        setAwayGuess={setAwayGuess}
        setDisabled={setDisabled}
        setDataType={setDataType}
      />
      {dataType === 'stale' &&
        <div className='result-flag'>
          No live games.  Play on games from week {getWeek()}
        </div>}
      <h2 className='team-name'>Enter your Username: </h2>
      <input className='username-input' value={userName} onChange={userNameChange} tabIndex='1'></input>
      <div className="scoreboard-container">
        <div className='scoreboard-wrapper'>
          {gameData && gameData !== 'none' &&
            <TeamElement game={gameData} logo={awayLogo} homeAway={false} guess={awayGuess} setGuess={setAwayGuess} yourScore={yourScore} disabled={disabled} />
          }
          <div className='title-wrapper'>
            <TitleImage />
            {gameData && gameData !== 'none' ?
              <div>
                <Timer updateTimer={timer} />
                <TimeRemaining gameData={gameData} />
                <button onClick={onClick} disabled={disabled} tabIndex='4' className='submit-button'>Submit Guesses</button>
              </div> :
              <div>
                <h3>The next round will start soon</h3>
              </div>
            }
          </div>
          {gameData && gameData !== 'none' &&
            <TeamElement game={gameData} logo={homeLogo} homeAway={true} guess={homeGuess} setGuess={setHomeGuess} yourScore={yourScore} disabled={disabled} />
          }
        </div>
      </div>
      <Score score={score} userName={userName} />
      <footer>Built by <a href="https://github.com/Scott-Andermann">Scott</a> - Powered by <a href="https://collegefootballdata.com/">CFBD</a></footer>
    </div>
  );
}

export default App;
