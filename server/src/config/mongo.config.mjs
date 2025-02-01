import mongoose from 'mongoose';


// MongoDB Connection Function
const mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { retryWrites: true, w: 'majority' });
        console.info("\x1b[32m✅ MongoDB Connected Successfully!\x1b[0m"); // Green text
    }
    catch (error) {
        console.error(`\x1b[31m❌ MongoDB Connection FAILED!\n ${error} \x1b[0m`);
    }
}


// // MongoDB Disconnection Function
// const mongoDisconnect = async () => {
//     try {
//         await mongoose.disconnect();
//         console.info('MongoDB Disconnected Successfully!!');
//     }
//     catch (error) {
//         console.warn('MongoDB Disconnection FAILED!! \n', error);
//     }
// }


// Exporting MongoDB Connection and Disconnection Functions
export default mongoConnect;
