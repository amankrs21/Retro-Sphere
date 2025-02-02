import mongoose from 'mongoose';


const ReviewSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    email: { type: String, required: true }
});


const RetroBoardModel = new mongoose.Schema({
    // retroId: {
    //     type: mongo.Schema.Types.ObjectId,
    //     ref: 'RetroModel',
    //     required: true
    // },
    retroId: {
        type: String,
        required: true,
        unique: true,
    },
    moods: {
        type: Array,
        required: true,
    },
    reviews: {
        startDoing: { type: [ReviewSchema], default: [] },
        stopDoing: { type: [ReviewSchema], default: [] },
        continueDoing: { type: [ReviewSchema], default: [] },
        appreciation: { type: [ReviewSchema], default: [] }
    },
});


export default mongoose.model('RetroBoardModel', RetroBoardModel);
