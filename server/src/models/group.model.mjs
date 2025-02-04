import mongoose from 'mongoose';

const GroupModel = new mongoose.Schema({
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
    members: [{
        type: mongo.Schema.Types.ObjectId,
        ref: 'UserModel',
    }],
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


export default mongoose.model('GroupModel', GroupModel);
