import React, { useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://localhost:8080');

const Socket = ({setTimer, setGameData}) => {

    useEffect(() => {
        client.onopen = () => {
            console.log('websocket client connected');
        };
        client.onmessage = (message) => {
            const parsed = JSON.parse(message.data);
            // console.log(parsed);
            if (parsed.type === 'timer') setTimer(parsed.post)
            if (parsed.type === 'gameData') setGameData([parsed.game])
        }
    })

    return (
        <></>
    )
}

export default Socket;