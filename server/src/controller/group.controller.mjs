import UserModel from "../models/user.model.mjs";
import GroupModel from "../models/group.model.mjs";
import MemberModel from "../models/member.model.mjs";
import { validateFields } from "../utils/validate.mjs";


// create a new group
const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const fieldValidation = validateFields({ name, members });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

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

        for (const group of groups) {
            const owner = await UserModel.findById(group.group.createdBy).select("email").lean();
            group.group.ownerEmail = owner.email;
        }

        const groupDetails = groups.map((member) => member.group);

        return res.status(200).json({
            groups: groupDetails,
        });

    } catch (error) {
        next(error);
    }
};


// fetch members of a group
const fetchGroupMembers = async (req, res, next) => {
    try {
        const members = await MemberModel.find({ group: req.params.groupId })
            .populate("user")
            .lean();

        members.forEach((member) => {
            member.email = member.user.email;
            member.name = member.user.name;
            delete member.user;
        });

        return res.status(200).json({ members });
    } catch (error) {
        next(error);
    }
};


// add member to a group
const addMember = async (req, res, next) => {
    try {
        const { email, groupId } = req.body;
        const fieldValidation = validateFields({ email, groupId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const group = await GroupModel.findOne({ _id: groupId });
        if (group?.createdBy.toString() !== req?.currentUser.toString()) {
            return res.status(401).json({ message: "You are not authorized to add members to this group" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const member = await MemberModel.find({ user: user._id, group: groupId });
        if (member?.length > 0) {
            return res.status(400).json({ message: "User is already a member of the group" });
        }

        const newMember = new MemberModel({
            user: user._id,
            group: groupId,
        });
        await newMember.save();

        return res.status(201).json({ message: "User added to group successfully" });
    } catch (error) {
        next(error);
    }
};


// delete member from a group
const deleteMember = async (req, res, next) => {
    try {
        const { email, groupId } = req.body;
        const fieldValidation = validateFields({ email, groupId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const group = await GroupModel.findOne({ _id: groupId });
        if (group.createdBy.toString() !== req.currentUser.toString()) {
            return res.status(401).json({ message: "You are not authorized to remove members from this group" });
        }

        const user = await UserModel.findOne({ email: email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (user._id.toString() === req.currentUser.toString())
            return res.status(400).json({ message: "You cannot remove yourself from the group" });

        const member = await MemberModel.find({ user: user._id, group: groupId });
        if (member?.length === 0) {
            return res.status(400).json({ message: "User is not a member of the group" });
        }
        await MemberModel.deleteOne({ user: user._id, group: groupId });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// delete a group
const deleteGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;

        const fieldValidation = validateFields({ groupId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const group = await GroupModel.findOne({ _id: groupId });
        if (group.createdBy.toString() !== req.currentUser.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this group" });
        }

        await MemberModel.deleteMany({ group: groupId });
        await GroupModel.deleteOne({ _id: groupId });

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// exporting functions
export { createGroup, fetchMyGroups, fetchGroupMembers, addMember, deleteMember, deleteGroup };
