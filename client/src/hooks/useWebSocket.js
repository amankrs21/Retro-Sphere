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

//         const socket = new WebSocket("ws://localhost:8080");
//         // const socket = new WebSocket(`${baseWSURL}?token=${encodeURIComponent(token)}&retroId=093284893294386`);
//         setWs(socket);

//         socket.onopen = () => console.log('WebSocket connected');
//         socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             if (message.type === 'initialData') {
//                 console.log("GOT INITIAL DATA");
//                 setRetroData(message.data);
//             } else if (message.type === 'update') {
//                 console.log("GOT UPDATE");
//                 setRetroData(message.data);
//             }
//         };
//         socket.onclose = () => console.log('WebSocket disconnected');
//         socket.onerror = (error) => console.error('WebSocket error:', error);

//         return () => socket.close();
//     }, [token, retroId]);

//     const updateEmoji = (emoji) => {
//         console.log("UPDATING EMOJI");
//         console.log({ type: 'updateEmoji', emoji, email: userData?.email });
//         ws?.send(JSON.stringify({ type: 'updateEmoji', emoji, email: userData.email }));
//     };

//     const addComment = (column, comment) => {
//         ws?.send(JSON.stringify({ type: 'addComment', column, comment, email: userData.email }));
//     };

//     return { retroData, updateEmoji, addComment };
// };



import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import AuthProvider from "../middleware/AuthProvider";

export const useWebSocket = (retroId) => {
    const [socket, setSocket] = useState(null);
    const [retroData, setRetroData] = useState(null);
    const { token, userData, baseWSURL } = AuthProvider();

    useEffect(() => {
        if (!token || !baseWSURL) {
            console.error("WebSocket connection requires a valid token.");
            return;
        }
        const retroId = "0987654321";
        const newSocket = io(baseWSURL, {
            query: { token, retroId },
            transports: ["websocket"],
        });
        setSocket(newSocket);

        newSocket.on("connect", () => console.log("WebSocket connected"));
        newSocket.on("disconnect", () => console.log("WebSocket disconnected"));

        newSocket.on("initialData", (data) => {
            console.log("GOT INITIAL DATA:", data);
            setRetroData(data);
        });

        newSocket.on("updateEmoji", ({ retroId: updatedRetroId, moods }) => {
            if (updatedRetroId === retroId) {
                console.log("GOT UPDATED EMOJI DATA");
                setRetroData((prev) => ({ ...prev, moods }));
            }
        });

        newSocket.on("addReview", ({ retroId: updatedRetroId, reviews }) => {
            if (updatedRetroId === retroId) {
                console.log("GOT ADD REVIEW DATA");
                setRetroData((prev) => ({ ...prev, reviews }));
            }
        });

        newSocket.on("updateReview", ({ retroId: updatedRetroId, reviews }) => {
            if (updatedRetroId === retroId) {
                console.log("GOT UPDATE REVIEW DATA");
                setRetroData((prev) => ({ ...prev, reviews }));
            }
        });

        return () => newSocket.disconnect();
    }, [token, retroId]);

    // TODO: Change updateEmoji to updateMood
    const updateEmoji = (emoji) => {
        console.log("UPDATING EMOJI", { emoji, email: userData?.email });
        socket?.emit("updateEmoji", { emoji, email: userData?.email });
    };

    const addReview = (column, comment) => {
        console.log("ADDING REVIEW", { column, comment, email: userData?.email });
        socket?.emit("addReview", { column, comment, email: userData?.email });
    };

    const updateReview = (column, comment, index) => {
        console.log("UPDATING REVIEW", { column, comment, index, email: userData?.email });
        socket?.emit("updateReview", { column, comment, index, email: userData?.email });
    };

    return { retroData, updateEmoji, addReview, updateReview };
};
