import { useEffect, useState } from 'react';

export const useWebSocket = (url: string) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessages((prev) => [...prev, event.data]);
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

    return { messages, sendMessage };
};
