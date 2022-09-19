import React from 'react';

// const clock = '00:00:00'
// const period = '2';

const TimeRemaining = ({gameData}) => {

    const formatTime = () => {
        if (gameData.clock === '00:00:00' && gameData.period === '2') return 'Half';
        let formattedTime = gameData.clock.slice(3);
        if (formattedTime[0] === 0) formattedTime = formattedTime.slice(1);


        return formattedTime;
    }

    return ( 
    <div className='clock'>
        <h3>{gameData.period}{gameData.clock ? ` - ${formatTime()}` : ''}</h3>
        {/* {gameData.Period.includes('F') ? <h3>Final</h3> : <h3>{gameData.Period} - {gameData.TimeRemainingMinutes}:{gameData.TimeRemainingSeconds}</h3>} */}
    </div> 
    );
}
 
export default TimeRemaining;