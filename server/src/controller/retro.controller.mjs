import UserModel from "../models/user.model.mjs";
import GroupModel from "../models/group.model.mjs";
import RetroModel from "../models/retro.model.mjs";
import MemberModel from "../models/member.model.mjs";
import { validateFields, santizeId } from "../utils/validate.mjs";


// create a new retro-board
const createRetro = async (req, res, next) => {
    try {
        const { name, groupId } = req.body;
        const fieldValidation = validateFields({ name, groupId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const retroExist = await RetroModel.findOne({ name });
        if (retroExist)
            return res.status(400).json({ message: "Retro name already exists, please try another name!" });

        const isMember = await MemberModel.findOne({ user: req.currentUser, group: groupId });
        if (!isMember)
            return res.status(401).json({ message: "You are not authorized to create a retro for this group" });

        const retro = new RetroModel({
            name,
            group: groupId,
            status: "active",
        });
        await retro.save();

        return res.status(201).json({ message: "Retro created successfully" });
    } catch (error) {
        next(error);
    }
};


// single retro complete data
const getRetroData = async (req, res, next) => {
    try {
        let { retroId } = req.params;
        retroId = santizeId(retroId);
        const fieldValidation = validateFields({ retroId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const retro = await RetroModel.findById(retroId);
        if (!retro)
            return null;

        const group = await GroupModel.findById(retro.group);
        const members = await MemberModel.find({ group: group._id }).populate("user", "name email");
        const users = members.map(member => member.user._id);

        // if (!users.includes(req.currentUser))
        //     return res.status(404).json({ message: "Invalid Path" });

        return res.status(200).json({ retro, group, users });
    } catch (error) {
        next(error);
    }
}


// delete a retro-board
const deleteRetro = async (req, res, next) => {
    try {
        let { retroId } = req.params;
        retroId = santizeId(retroId);
        const fieldValidation = validateFields({ retroId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });


        const retro = await RetroModel.findById(retroId);
        if (!retro)
            return res.status(404).json({ message: "Retro not found" });

        const group = await GroupModel.findById(retro.group);
        if (group.createdBy.toString() !== req.currentUser)
            return res.status(401).json({ message: "You are not authorized to delete this retro" });

        await RetroModel.findByIdAndDelete(retroId);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// change status to completed
const completeRetro = async (req, res, next) => {
    try {
        let { retroId } = req.params;
        retroId = santizeId(retroId);
        const fieldValidation = validateFields({ retroId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const retro = await RetroModel.findById(retroId);
        if (!retro)
            return res.status(404).json({ message: "Retro not found" });

        // const group = await GroupModel.findById(retro.group);
        // if (group.createdBy.toString() !== req.currentUser)
        //     return res.status(401).json({ message: "You are not authorized to complete this retro" });

        await RetroModel.findByIdAndUpdate(retroId, { status: "completed" });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};


// exprting functions
export { createRetro, deleteRetro, completeRetro, getRetroData };
