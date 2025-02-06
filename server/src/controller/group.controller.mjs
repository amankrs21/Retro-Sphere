import UserModel from "../models/user.model.mjs";
import GroupModel from "../models/group.model.mjs";
import MemberModel from "../models/member.model.mjs";


// create a new group
const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;

        // Check if group name already exists
        const groupExist = await GroupModel.findOne({ name });
        if (groupExist) {
            return res.status(400).json({
                message: "Group name not available, please try another name!",
            });
        }

        // Create the group
        const group = new GroupModel({
            name,
            status: "active",
            createdBy: req.currentUser,
        });
        await group.save();

        // Fetch all members in a single query
        const existingUsers = await UserModel.find({ email: { $in: members } });

        const membersIdSet = new Set(existingUsers.map((user) => user._id.toString()));
        const memberNotFound = members.filter(
            (email) => !existingUsers.some((user) => user.email === email)
        );

        // Ensure current user is included
        if (![...membersIdSet].some((id) => id.toString() === req.currentUser.toString())) {
            membersIdSet.add(req.currentUser.toString());
        }

        // Convert Set back to Array
        const membersId = [...membersIdSet];

        // Add members to the group
        for (const member of membersId) {
            const memberModel = new MemberModel({
                user: member,
                group: group._id,
            });
            await memberModel.save();
        }

        return res.status(201).json({
            message: "Group created successfully",
            group,
            memberNotFound,
        });
    } catch (error) {
        next(error);
    }
};



// fetch my groups
const fetchMyGroups = async (req, res, next) => {
    try {
        const groups = await MemberModel.find({ user: req.currentUser })
            .populate("group")
            .lean(); // Convert to plain JS objects

        // // Add isOwner property based on createdBy
        // groups.forEach((member) => {
        //     member.isOwner = member.group.createdBy.toString() === req.currentUser.toString();
        // });

        // fetch group owner email
        for (const group of groups) {
            const owner = await UserModel.findById(group.group.createdBy).select("email").lean();
            group.group.ownerEmail = owner.email;
        }

        // I only want to return group details
        const groupDetails = groups.map((member) => member.group);

        return res.status(200).json({
            groups: groupDetails,
        });

    } catch (error) {
        next(error);
    }
};



// exporting functions
export { createGroup, fetchMyGroups };
