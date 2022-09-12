import React, { useEffect, useState } from "react";

const Game = ({ game, logos }) => {
  const [homeLogo, setHomeLogo] = useState("");
  const [awayLogo, setAwayLogo] = useState("");

  const getLogo = (id) => {
    const team = logos.find((logo) => logo.TeamID === id);
    const url = team.TeamLogoUrl;
    return url;
  };
  let imgUrl = "";

  useEffect(() => {
    setHomeLogo(getLogo(game.HomeTeamID));
    setAwayLogo(getLogo(game.AwayTeamID));
  }, [logos, game]);

  return (
    <div style={{ border: "1px solid black", display: "flex" }}>
      <div style={{ width: "400px", height: "400px" }}>
        <h2>{game.AwayTeamName}</h2>
        {awayLogo !== "" && (
          <img src={awayLogo} style={{ width: "40%", height: "40%" }} />
        )}
        <h3>{game.AwayTeamScore}</h3>
      </div>
      <div style={{ width: "400px", height: "400px" }}>
        <h2>{game.HomeTeamName}</h2>
        {homeLogo !== "" && (
          <img src={homeLogo} style={{ width: "40%", height: "40%" }} />
        )}
        <h3>{game.HomeTeamScore}</h3>
      </div>
    </div>
  );
};

export default Game;
