import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import React, { useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:8080');

export const sendScoreToServer = ({score, userName}) => {
    client.send(JSON.stringify({type: 'score', userName: userName, score: score}));
}

const Socket = ({setTimer, setGameData, setScore, setTopUser, setHomeGuess, setAwayGuess}) => {

    useEffect(() => {
        client.onopen = () => {
            console.log('websocket client connected');
        };
        client.onmessage = (message) => {
            const parsed = JSON.parse(message.data);
            // console.log(parsed);
            if (parsed.type === 'timer') setTimer(parsed.time)
            if (parsed.type === 'gameData') {
                setGameData([parsed.game])
                setHomeGuess(0);
                setAwayGuess(0);
            }
            if (parsed.type === 'score') {
                setTopUser(parsed.userName);
                setScore(parsed.score)
            }
        }
    }, [])

    return (
        <></>
    )
}

export default Socket;