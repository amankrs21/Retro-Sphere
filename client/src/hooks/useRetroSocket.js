// import { useEffect, useState } from 'react';

// import AuthProvider from '../middleware/AuthProvider';


// export const useWebSocket = (retroId) => {
//     const [ws, setWs] = useState(null);
//     const [retroData, setRetroData] = useState(null);
//     const { token, userData, baseWSURL } = AuthProvider();

//     useEffect(() => {
//         if (!token || !baseWSURL) {
//             console.error('WebSocket connection requires a valid token and BaseUrl.');
//             return;
//         }

//         const socket = new WebSocket(`${baseWSURL}?token=${encodeURIComponent(token)}&retroId=093284893294386`);
//         setWs(socket);

//         socket.onopen = () => console.log('WebSocket connected');
//         socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             if (message.type === 'initialData') {
//                 setRetroData(message.data);
//             } else if (message.type === 'update') {
//                 setRetroData(message.data);
//             }
//         };
//         socket.onclose = () => console.log('WebSocket disconnected');
//         socket.onerror = (error) => console.error('WebSocket error:', error);

//         return () => socket.close();
//     }, [token, retroId, baseWSURL]);

//     const updateEmoji = (emoji) => {
//         ws?.send(JSON.stringify({ type: 'updateEmoji', emoji, email: userData.email }));
//     };

//     const addComment = (column, comment) => {
//         ws?.send(JSON.stringify({ type: 'addComment', column, comment, email: userData.email }));
//     };

//     return { retroData, updateEmoji, addComment };
// };







import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function useRetroSocket(retroId) {
    const [socket, setSocket] = useState(null);
    const [boardData, setBoardData] = useState(null);
    const { token } = useAuth();
    const reconnect = useRef(null);

    const connect = useCallback(() => {
        if (!token || !retroId) return;

        const ws = new WebSocket(
            `ws://localhost:3001?token=${token}&retroId=${retroId}`
        );

        ws.onopen = () => {
            console.log('WebSocket connected');
            if (reconnect.current) clearTimeout(reconnect.current);
        };

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            if (type === 'INITIAL_DATA' || type === 'STATE_UPDATE') {
                setBoardData(data);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected - attempting reconnect...');
            reconnect.current = setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.close();
        };

        setSocket(ws);
    }, [token, retroId]);

    useEffect(() => {
        connect();
        return () => {
            if (socket) socket.close();
            if (reconnect.current) clearTimeout(reconnect.current);
        };
    }, [connect]);

    const sendMessage = useCallback((type, data) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type, data }));
        }
    }, [socket]);

    return {
        boardData,
        updateEmoji: (emoji) => sendMessage('EMOJI_UPDATE', { emoji }),
        addComment: (column, text) => sendMessage('COMMENT_ADD', { column, text })
    };
}