import mongoose from 'mongoose';

const RetroModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    groupId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'GroupModel',
        required: true
    },
    createdBy: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export default mongoose.model('RetroModel', RetroModel);
