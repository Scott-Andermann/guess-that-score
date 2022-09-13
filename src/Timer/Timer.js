import React from 'react';
import './Timer.css';

const Timer = ({timer}) => {

    return (
        <div id="countdown">
            <div id="countdown-number">{Math.round(timer)}</div>
            <svg>
                <circle r="36" cx="40" cy="40"></circle>
            </svg>
        </div>
    );
}

export default Timer;