import React from "react";
import "./Score.css";

const Score = ({ score, userName, yourScore }) => {
  // console.log(score);
  return (
    <div className="score-wrapper">
      <h2 className="score-header">Top Scores</h2>
      <table className="score-table">
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
        <tbody>

        {score.length > 0 &&
          score
          .sort((a, b) => {
            return a.score - b.score;
          })
          .map((scoreElement, index) => (
            <tr
            key={index}
            className={
              scoreElement.userName === userName &&
              scoreElement.score === yourScore
              ? "highlight"
              : ""
            }
            >
                <td>{index + 1}</td>
                <td>{scoreElement.userName}</td>
                <td>{scoreElement.score}</td>
              </tr>
            ))}
            </tbody>
      </table>
    </div>
  );
};

export default Score;
