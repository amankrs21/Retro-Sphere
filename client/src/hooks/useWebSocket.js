import { useEffect, useState } from 'react';

import AuthProvider from '../middleware/AuthProvider';


export const useWebSocket = (retroId) => {
    const [ws, setWs] = useState(null);
    const [retroData, setRetroData] = useState(null);
    const { token, userData, baseWSURL } = AuthProvider();

    useEffect(() => {
        if (!token && !baseWSURL) {
            console.error('WebSocket connection requires a valid token and BaseUrl.');
            return;
        }

        const socket = new WebSocket(`${baseWSURL}?token=${encodeURIComponent(token)}&retroId=093284893294386`);
        setWs(socket);

        socket.onopen = () => console.log('WebSocket connected');
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'initialData') {
                setRetroData(message.data);
            } else if (message.type === 'update') {
                setRetroData(message.data);
            }
        };
        socket.onclose = () => console.log('WebSocket disconnected');
        socket.onerror = (error) => console.error('WebSocket error:', error);

        return () => socket.close();
    }, [token, retroId]);

    const updateEmoji = (emoji) => {
        ws?.send(JSON.stringify({ type: 'updateEmoji', emoji, email: userData.email }));
    };

    const addComment = (column, comment) => {
        ws?.send(JSON.stringify({ type: 'addComment', column, comment, email: userData.email }));
    };

    return { retroData, updateEmoji, addComment };
};
