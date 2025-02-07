import mongoose from "mongoose";

const MemberModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
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

export default mongoose.model("MemberModel", MemberModel);
