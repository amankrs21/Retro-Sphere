import GroupModel from "../models/group.model.mjs";


// create a new group
const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const group = new GroupModel({
            name,
            members,
            status: 'active',
            createdBy: req.user._id,
        });
        await group.save();
        res.status(201).json({ message: "Group created successfully!" });
    } catch (error) {
        next(error);
    }
};
