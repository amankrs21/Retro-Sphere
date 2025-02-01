// (async () => {
//     const { WebSocketServer } = await import('ws');
//     const { default: jwt } = await import('jsonwebtoken');
//     const { default: mongoose } = await import('mongoose');


//     // Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     // Retro schema
//     const retroSchema = new mongoose.Schema({
//         retroId: String,
//         moods: Array,
//         reviews: Object,
//     });

//     const Retro = mongoose.model('Retro', retroSchema);

//     const webSocket = new WebSocketServer({ port: process.env.WS_PORT ?? 3001 });

//     const clients = new Map(); // Map to store connected clients and their retroId

//     webSocket.on('connection', async (ws, req) => {
//         const urlParams = new URLSearchParams(req.url.split('?')[1]);
//         const token = urlParams.get('token');
//         const retroId = urlParams.get('retroId'); // Include retroId in the WebSocket URL

//         if (!token || !retroId) {
//             ws.close(4001, 'Unauthorized: Missing token or retroId');
//             return;
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(`User connected: ${decoded.email}`);

//             // Store the client connection
//             clients.set(ws, { email: decoded.email, retroId });

//             // Load retro data from DB or initialize
//             let retroData = await Retro.findOne({ retroId });
//             if (!retroData) {
//                 retroData = new Retro({
//                     retroId,
//                     moods: [
//                         { emoji: 0, users: [] },
//                         { emoji: 1, users: [] },
//                         { emoji: 2, users: [] },
//                         { emoji: 3, users: [] },
//                         { emoji: 4, users: [] }
//                     ],
//                     reviews: {
//                         startDoing: [],
//                         stopDoing: [],
//                         continueDoing: [],
//                         appreciation: [],
//                     },
//                 });
//                 await retroData.save();
//             }

//             ws.send(JSON.stringify({ type: 'initialData', data: retroData }));

//             ws.on('message', async (message) => {
//                 const parsedMessage = JSON.parse(message);

//                 if (parsedMessage.type === 'updateEmoji') {
//                     const { emoji: incomingEmoji, email } = parsedMessage;
//                     console.log("DATA RECEIVED => ", { emoji: incomingEmoji, email });

//                     // find the email in the moods array and remove that email from that array
//                     const index = retroData.moods.findIndex((data) => data.users.includes(email));
//                     if (index !== -1) {
//                         retroData.moods[index].users = retroData.moods[index].users.filter((user) => user !== email);
//                     }

//                     console.log("IN BETWEEN DATA => ", retroData.moods);
//                     // find the emoji in the moods array and add the email to that array
//                     retroData.moods[incomingEmoji].users.push(email);

//                     console.log("UPDATED DATA => ", retroData.moods);
//                 }
//                 // else if (parsedMessage.type === 'addComment') {
//                 //     const { column, comment, email } = parsedMessage;
//                 //     retroData.comments[column].push({ comment, createdBy: email });
//                 // }

//                 // Save updates to the database
//                 await Retro.updateOne({ retroId }, retroData);

//                 // Broadcast updated data to all clients in the same retroId
//                 await broadcastToRetro(retroId, {
//                     type: 'update',
//                     data: retroData,
//                 });
//             });

//             ws.on('close', () => {
//                 console.log(`User disconnected: ${decoded.email}`);
//                 clients.delete(ws);
//             });
//         } catch (error) {
//             console.error('Invalid token:', error.message);
//             ws.close(4001, 'Unauthorized: Invalid token');
//         }
//     });

//     const broadcastToRetro = async (retroId, message) => {
//         for (const [client, clientData] of clients) {
//             if (clientData.retroId === retroId && client.readyState === WebSocket.OPEN) {
//                 await client.send(JSON.stringify(message));
//             }
//         }
//     };

//     console.log(`WebSocket Server started on PORT: ${process.env.WS_PORT ?? 3001}`);
// })();





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
        moods: Array,
        reviews: Object,
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
                    moods: [
                        { emoji: 0, users: [] },
                        { emoji: 1, users: [] },
                        { emoji: 2, users: [] },
                        { emoji: 3, users: [] },
                        { emoji: 4, users: [] }
                    ],
                    reviews: {
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

                // Replace the current 'updateEmoji' handler with this:
                if (parsedMessage.type === 'updateEmoji') {
                    const { emoji: incomingEmoji, email } = parsedMessage;
                    console.log("DATA RECEIVED => ", { emoji: incomingEmoji, email });

                    // Atomic MongoDB operation: Remove user from all moods + add to new mood
                    await Retro.updateOne(
                        { retroId },
                        [
                            {
                                $set: {
                                    moods: {
                                        $map: {
                                            input: "$moods",
                                            as: "mood",
                                            in: {
                                                $cond: [
                                                    { $eq: ["$$mood.emoji", incomingEmoji] },
                                                    {
                                                        $mergeObjects: [
                                                            "$$mood",
                                                            { users: { $concatArrays: ["$$mood.users", [email]] } }
                                                        ]
                                                    },
                                                    {
                                                        $mergeObjects: [
                                                            "$$mood",
                                                            {
                                                                users: {
                                                                    $filter: {
                                                                        input: "$$mood.users",
                                                                        cond: { $ne: ["$$this", email] }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    );

                    // Fetch fresh data from DB to broadcast
                    const updatedRetro = await Retro.findOne({ retroId });

                    broadcastToRetro(retroId, {
                        type: 'update',
                        data: updatedRetro
                    });
                }
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
