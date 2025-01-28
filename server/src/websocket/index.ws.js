(async () => {
    const { WebSocketServer } = await import('ws');
    const { default: jwt } = await import('jsonwebtoken');
    const { default: mongoose } = await import('mongoose');


    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Retro schema
    const retroSchema = new mongoose.Schema({
        retroId: String,
        emojis: Object,
        comments: Object,
    });

    const Retro = mongoose.model('Retro', retroSchema);

    const webSocket = new WebSocketServer({ port: process.env.WS_PORT ?? 3001 });

    const clients = new Map(); // Map to store connected clients and their retroId

    webSocket.on('connection', async (ws, req) => {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const token = urlParams.get('token');
        const retroId = urlParams.get('retroId'); // Include retroId in the WebSocket URL

        if (!token || !retroId) {
            ws.close(4001, 'Unauthorized: Missing token or retroId');
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(`User connected: ${decoded.email}`);

            // Store the client connection
            clients.set(ws, { email: decoded.email, retroId });

            // Load retro data from DB or initialize
            let retroData = await Retro.findOne({ retroId });
            if (!retroData) {
                retroData = new Retro({
                    retroId,
                    emojis: {
                        "😀": { users: [] },
                        "🙂": { users: [] },
                        "😐": { users: [] },
                        "😞": { users: [] },
                        "😡": { users: [] },
                    },
                    comments: {
                        startDoing: [],
                        stopDoing: [],
                        continueDoing: [],
                        appreciation: [],
                    },
                });
                await retroData.save();
            }

            ws.send(JSON.stringify({ type: 'initialData', data: retroData }));

            ws.on('message', async (message) => {
                const parsedMessage = JSON.parse(message);

                if (parsedMessage.type === 'updateEmoji') {
                    const { emoji, email } = parsedMessage;
                    Object.keys(retroData.emojis).forEach((key) => {
                        retroData.emojis[key].users = retroData.emojis[key].users.filter((user) => user !== email);
                    });
                    retroData?.emojis[emoji]?.users.push(email);
                } else if (parsedMessage.type === 'addComment') {
                    const { column, comment, email } = parsedMessage;
                    retroData.comments[column].push({ comment, createdBy: email });
                }

                // Save updates to the database
                await Retro.updateOne({ retroId }, retroData);

                // Broadcast updated data to all clients in the same retroId
                broadcastToRetro(retroId, {
                    type: 'update',
                    data: retroData,
                });
            });

            ws.on('close', () => {
                console.log(`User disconnected: ${decoded.email}`);
                clients.delete(ws);
            });
        } catch (error) {
            console.error('Invalid token:', error.message);
            ws.close(4001, 'Unauthorized: Invalid token');
        }
    });

    const broadcastToRetro = (retroId, message) => {
        for (const [client, clientData] of clients) {
            if (clientData.retroId === retroId && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        }
    };

    console.log(`WebSocket Server started on PORT: ${process.env.WS_PORT ?? 3001}`);
})();
