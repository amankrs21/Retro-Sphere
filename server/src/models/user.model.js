const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserModel', UserModel);
