import React from "react";

const Score = ({score, yourScore, yourBestScore, topUser}) => {

    return (
        <div>
            {score >= 0 ? <h2>This Round's Best Score by {topUser}: {score}</h2> : <h2>No Best Score Yet</h2>}
            <h2>Your Score On This Round: {yourScore}</h2>
            <h2>Your Best Score: {yourBestScore}</h2>
        </div>
    )
}

export default Score;