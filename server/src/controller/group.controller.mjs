import GroupModel from "../models/group.model.mjs";


// create a new group
const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;

        // check if group name already exists
        const groupExist = await GroupModel.findOne({ name });
        if (groupExist) {
            return res.status(400).json({
                message: "Group name already exists",
            });
        }
        const group = new GroupModel({
            name,
            status: "active",
            createdBy: req.userId,
        });
        await group.save();

        // find members id from database
        const memberNotFound = [];
        const membersId = [req.userId];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const memberExist = await UserModel.findOne({ email: member });
            if (!memberExist) {
                memberNotFound.push(member);
            } else {
                membersId.push(memberExist._id);
            }
        }

        // add members to group
        await MemberModel.insertMany(
            membersId.map((memberId) => ({
                user: memberId,
                status: "active",
                group: group._id,
            }))
        );

        return res.status(201).json({
            message: "Group created successfully",
            group,
            memberNotFound,
        });
    } catch (error) {
        next(error);
    }
};



// fetch groupd and their members
const fetchGroups = async (req, res, next) => {
    try {
        const groups = await GroupModel.find({ createdBy: req.userId }).populate(
            "members"
        );
        return res.status(200).json({
            groups,
        });
    } catch (error) {
        next(error);
    }
};

// exporting functions
export { createGroup, fetchGroups };
