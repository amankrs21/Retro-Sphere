import { addReview } from "./addReview.mjs";
import { updateMood } from "./updateMood.mjs";
import { updateReview } from "./updateReview.mjs";
import { validateUser } from "./validateUser.mjs";
import { retroIntialReq } from "./retroIntialReq.mjs";

export function setupSocket(io) {
    // store connected clients
    const clients = new Map();

    // websocket connection handler
    io.on("connection", async (socket, req) => {

        // validate request
        const token = socket?.handshake?.query?.token ?? null;
        const retroId = socket?.handshake?.query?.retroId ?? null;
        if (!token || !retroId) {
            console.error("Invalid request");
            socket.disconnect(true);
            return;
        }

        // validate user
        const user = await validateUser(token);
        if (!user) {
            console.error("Invalid user");
            socket.disconnect(true);
            return;
        }
        console.log("User Connected:", user.email);
        clients.set(socket, { email: user.email, retroId });


        // handle user requests
        const retroData = await retroIntialReq(retroId);
        socket.emit("initialData", retroData);


        // handle user disconnection
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${user.email}`);
            clients.delete(socket);
        });


        // handle update emoji
        socket.on("updateMood", async (data) => {
            const response = await updateMood(retroId, data);
            if (response) {
                io.emit("updateMood", { retroId, moods: response });
            }
        });


        // handle add review
        socket.on("addReview", async (data) => {
            const response = await addReview(retroId, data);
            if (response) {
                io.emit("addReview", { retroId, reviews: response });
            }
        });


        // handle update review
        socket.on("updateReview", async (data) => {
            const response = await updateReview(retroId, data);
            if (response) {
                io.emit("updateReview", { retroId, reviews: response });
            }
        });
    });
}
