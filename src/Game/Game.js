import React, { useEffect, useState } from "react";
import TeamElement from "./TeamElement";

const Game = ({ game, logos, yourScore, homeGuess, setHomeGuess, awayGuess, setAwayGuess }) => {
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");
  

  
  useEffect(() => {
    const getLogo = (id) => {
      const team = logos.find((logo) => logo.TeamID === id);
      const url = team.TeamLogoUrl;
      return url;
    };
    setHomeLogo(getLogo(game.HomeTeamID));
    setAwayLogo(getLogo(game.AwayTeamID));
  }, [logos, game]);

  return (
    <div style={{ border: "1px solid black" }}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <TeamElement game={game} logo={awayLogo} homeAway={false} guess={awayGuess} setGuess={setAwayGuess} yourScore={yourScore}/>
        <h2>VS</h2>
        <TeamElement game={game} logo={homeLogo} homeAway={true} guess={homeGuess} setGuess={setHomeGuess} yourScore={yourScore}/>  
      </div>
    </div>
  );
};

export default Game;
