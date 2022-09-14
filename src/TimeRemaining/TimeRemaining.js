import React from 'react';

const TimeRemaining = ({gameData}) => {
    return ( 
    <div>
        <h3>Final</h3>
        {/* {gameData.Period.includes('F') ? <h3>Final</h3> : <h3>{gameData.Period} - {gameData.TimeRemainingMinutes}:{gameData.TimeRemainingSeconds}</h3>} */}
    </div> 
    );
}
 
export default TimeRemaining;