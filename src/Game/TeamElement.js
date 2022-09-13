import React from "react";

const TeamElement = ({game, logo, homeAway, guess, setGuess, yourScore}) => {

    const onChange = (e) => {
        setGuess(e.target.value);
    }

    return (
        <div className='team-wrapper'>
            <h2>{homeAway ? game.HomeTeamName : game.AwayTeamName}</h2>
            {logo !== "" && (
                <img src={logo} style={{ width: "40%"}} alt={`${homeAway ? game.HomeTeamName : game.AwayTeamName} logo`} />
                )}
                <input className='score-input' type='number' value={guess} onChange={onChange}></input>
            {yourScore >= 0 && typeof(yourScore) == 'number' ? <h3 className='score-actual'>{homeAway ? game.HomeTeamScore : game.AwayTeamScore}</h3> : <h3 className='score-actual'>--</h3>}
        </div>
    )
}

export default TeamElement;