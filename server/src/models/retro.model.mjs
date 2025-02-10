import mongoose from 'mongoose';

const RetroModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GroupModel",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export default mongoose.model('RetroModel', RetroModel);
