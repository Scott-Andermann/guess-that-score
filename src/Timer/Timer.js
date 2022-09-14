import React, { useState, useEffect } from 'react';
import './Timer.css';

let startTime, prevTime;
let done = false;

function Timer({updateTimer}) {

    const [timer, setTimer] = useState(0);
    // const [startTime, setStartTime] = useState(0);
    const [animation, setAnimation] = useState(0);


    
    useEffect(() => {
        function timerAnimation(time) {
            // recursive function used to get accurate timing from initial click
            if (startTime === undefined) {
                // set starting time - this is not set as a state of the page though
                startTime = time;
            }
            const elapsed = time - startTime;
            const upperLimit = 20000;
    
            if (prevTime !== time && !done) {
                const count = Math.min(elapsed, upperLimit);
                setTimer(count);
                if (count === upperLimit) {
                    done = true;
                    startTime = undefined;
                }
            }
    
            if (elapsed < 500) {
                prevTime = time;
                if (!done) {
                    window.requestAnimationFrame(timerAnimation);
                }
            }
        }
        // console.log(updateTimer)
        window.requestAnimationFrame(timerAnimation)
        if (updateTimer >= 19 && timer > 10) {
            console.log('starting timer')
            done = false;
            startTime = undefined;
            setTimer(0);
            // setAnimation(1);
        }
        // if (updateTimer <= 0) {
        //     setAnimation(0);
        // }
        
    }, [timer, updateTimer]); //trigger useEffect loop on timer and isActive state changes

    const handleClick = () => {
        // setAnimation(animation => !animation);
        setAnimation(animation => {
            if (animation === 1) {
                return 0;
            } else return 1;
        });
    }


    return (
        <div className='SpinTimer container'>
            <div className='outer'
                timercircle={animation}>
                <div className='inner'
                    onClick={handleClick}>
                    <h2 style={{fontSize: '2rem'}}>{Number(20 - timer / 1000).toFixed(1)}</h2>
                </div>
            </div>
        </div>
    );
}

export default Timer;