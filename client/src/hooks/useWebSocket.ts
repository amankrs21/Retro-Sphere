import { useEffect, useState } from 'react';

interface RetroBoardData {
    mood: string;
    startDoing: string[];
    stopDoing: string[];
    continueDoing: string[];
    appreciation: string[];
}

export const useWebSocket = (url: string) => {
    const [retroBoardData, setRetroBoardData] = useState<RetroBoardData>({
        mood: '',
        startDoing: [],
        stopDoing: [],
        continueDoing: [],
        appreciation: []
    });
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const data = JSON.parse(event.data);
            setRetroBoardData(data);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    };

    // Function to update mood
    const updateMood = (mood: string) => {
        const message = JSON.stringify({ type: 'updateMood', mood });
        sendMessage(message);
    };

    // Function to update columns
    const updateColumn = (column: string, text: string) => {
        const message = JSON.stringify({ type: 'updateColumn', column, text });
        sendMessage(message);
    };

    return { retroBoardData, updateMood, updateColumn };
};
