import React, { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('wss://guess-that-score.herokuapp.com');

// const client = new W3CWebSocket('ws://localhost:8080');

export const sendScoreToServer = ({ score, userName }) => {
    client.send(JSON.stringify({ type: 'score', userName: userName, score: score }));
}

const Socket = ({ setTimer, setGameData, setScore, setTopUser, setHomeGuess, setAwayGuess, setDisabled, setDataType }) => {
    const [connected, setConnected] = useState(true);

    useEffect(() => {
        client.onopen = () => {
            console.log('websocket client connected');
        };
        client.onmessage = (message) => {
            const parsed = JSON.parse(message.data);
            // console.log(parsed);
            if (parsed.type === 'timer') setTimer(parsed.time)
            if (parsed.type === 'gameData') {
                // console.log(parsed.game)
                setDataType(parsed.dataType);
                setGameData(parsed.game)
                if (parsed.game === undefined) {
                    setGameData(['none'])
                }
                setHomeGuess(0);
                setAwayGuess(0);
                setDisabled(false);
            }
            if (parsed.type === 'score') {
                // setTopUser(parsed.userName);
                setScore(parsed.score)
            }
        };
        client.onclose = () => {
            setConnected(false);
        }
    }, [setTimer, setGameData, setScore, setTopUser, setHomeGuess, setAwayGuess, setDisabled, setDataType])

    return (
        <>
            {!connected && 
            <div className='connection'>
                <h1>Connection lost, please reload page</h1>
            </div>}
        </>
    )
}

export default Socket;