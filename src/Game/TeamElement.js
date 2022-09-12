import React from "react";

const TeamElement = ({game, logo, homeAway, guess, setGuess, yourScore}) => {

    const onChange = (e) => {
        setGuess(e.target.value);
    }

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <h2>{homeAway ? game.HomeTeamName : game.AwayTeamName}</h2>
            {logo !== "" && (
                <img src={logo} style={{ width: "40%", height: "40%" }} />
            )}
            <input type='number' value={guess} onChange={onChange}></input>
            {yourScore >= 0 && typeof(yourScore) == 'number' && <h3>{homeAway ? game.HomeTeamScore : game.AwayTeamScore}</h3>}
        </div>
    )
}

export default TeamElement;