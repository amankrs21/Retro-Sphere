import React, { createContext, useState, useEffect, useContext } from 'react';

interface RetroBoardData {
    mood: string;
    startDoing: string[];
    stopDoing: string[];
    continueDoing: string[];
    appreciation: string[];
}

const WebSocketContext = createContext<any>(null);

export const WebSocketProvider: React.FC = ({ children }) => {
    const [retroBoardData, setRetroBoardData] = useState<RetroBoardData>({
        mood: '',
        startDoing: [],
        stopDoing: [],
        continueDoing: [],
        appreciation: [],
    });

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setRetroBoardData(data);
        };

        return () => {
            socket.close();
        };
    }, []);

    const updateMood = (mood: string) => {
        const socket = new WebSocket('ws://localhost:3000');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'updateMood', mood }));
        };
    };

    const updateColumn = (column: string, text: string) => {
        const socket = new WebSocket('ws://localhost:3000');
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'updateColumn', column, text }));
        };
    };

    return (
        <WebSocketContext.Provider value={{ retroBoardData, updateMood, updateColumn }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
