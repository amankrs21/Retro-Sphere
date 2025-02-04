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
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
});

export default mongoose.model("MemberModel", MemberModel);
