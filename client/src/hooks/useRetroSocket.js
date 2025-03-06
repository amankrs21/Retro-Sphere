import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useAuth } from "./useAuth";


// Custom hook to use the WebSocket connection
export const useRetroSocket = (retroId) => {
    const [socket, setSocket] = useState(null);
    const [retroData, setRetroData] = useState(null);
    const [celebrate, setCelebrate] = useState(false);
    const [popoutEmoji, setPopoutEmoji] = useState(null);

    const { token, userData, baseWSURL, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!token || !baseWSURL || !isAuthenticated || !retroId) {
            console.error("WebSocket connection requires a valid token.");
            return;
        }
        const newSocket = io(baseWSURL, {
            query: { token, retroId },
            transports: ["websocket"],
        });
        setSocket(newSocket);

        newSocket.on("connect", () => console.log("WebSocket connected"));
        newSocket.on("disconnect", () => console.log("WebSocket disconnected"));

        // handle initial data
        newSocket.on("initialData", (data) => {
            setRetroData(data);
        });

        // handle update mood
        newSocket.on("updateMood", ({ retroId: updatedRetroId, moods }) => {
            if (updatedRetroId === retroId) {
                setRetroData((prev) => ({ ...prev, moods }));
            }
        });

        // handle emoji pop out
        newSocket.on("emojiPopOut", ({ retroId: updatedRetroId, emoji }) => {
            if (updatedRetroId === retroId) {
                setPopoutEmoji(emoji);
                setTimeout(() => { setPopoutEmoji(null); }, 1000);
            }
        });

        // handle add review
        newSocket.on("addReview", ({ retroId: updatedRetroId, reviews }) => {
            if (updatedRetroId === retroId) {
                setRetroData((prev) => ({ ...prev, reviews }));
            }
        });

        // handle update review
        newSocket.on("updateReview", ({ retroId: updatedRetroId, reviews }) => {
            if (updatedRetroId === retroId) {
                setRetroData((prev) => ({ ...prev, reviews }));
            }
        });

        // handle complete retro
        newSocket.on("completeRetro", () => {
            setCelebrate(true);
            setTimeout(() => { setCelebrate(false); }, 8000);
        });

        return () => newSocket.disconnect();
    }, [token, baseWSURL, retroId, isAuthenticated]);


    // update mood
    const updateMood = (emoji) => {
        socket?.emit("updateMood", { emoji, email: userData?.email });
    };

    // add review
    const addReview = (column, comment) => {
        socket?.emit("addReview", { column, comment, email: userData?.email });
    };

    // update review
    const updateReview = (column, comment, index) => {
        socket?.emit("updateReview", { column, comment, index, email: userData?.email });
    };

    // complete retro
    const completeRetro = () => {
        socket?.emit("completeRetro");
    };


    // return the data and functions
    return { retroData, celebrate, popoutEmoji, updateMood, addReview, updateReview, completeRetro };
};
