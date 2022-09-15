import React from "react";
import './Score.css';

const Score = ({score, yourScore, topUser}) => {
    // console.log(score);
    return (
        <div className='score-wrapper'>
            <div style={{marginRight: 0.25 + 'rem'}}>
                <h2 className='score-header'>Top Score</h2>
                {score !== null ? <h3>{topUser}: {score}</h3> : <h3>--</h3> }
            </div>
            <div style={{marginLeft: 0.25 + 'rem'}}>
                <h2 className='score-header'>Your Score</h2>
                {yourScore !== null ? <h3>{yourScore}</h3> : <h3>--</h3> }
            </div>
        </div>
    )
}

export default Score;