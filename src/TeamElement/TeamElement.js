import React from "react";
import './TeamElement.css'

const TeamElement = ({game, logo, homeAway, guess, setGuess, yourScore, disabled}) => {

    const teamScore = homeAway ? game.HomeTeamScore : game.AwayTeamScore;

    const onChange = (e) => {
        if (e.target.value > 99) return
        setGuess(e.target.value);
    }

    return (
        <div className='team-wrapper'>
            <div className='team-title'>
            <h2 className='team-name'>{homeAway ? game.HomeTeamName : game.AwayTeamName}</h2>
            </div>
            {logo !== "" && (
                <img className='team-image' src={logo} alt={`${homeAway ? game.HomeTeamName : game.AwayTeamName} logo`} />
                )}
                <input className='score-input' type='number' value={guess} onChange={onChange} disabled={disabled} tabIndex='2'></input>
            {yourScore >= 0 && typeof(yourScore) == 'number' ? 
            <div className='score-actual-wrapper'>
                <h3 className='score-actual'>{teamScore}</h3>
                <p className={guess-teamScore === 0 ? 'green' : 'yellow'}>+{Math.abs(guess-teamScore)}</p>
            </div> : 
                <h3 className='score-actual'>--</h3>
                }
        </div>
    )
}

export default TeamElement;