import ExcelJS from "exceljs";

import GroupModel from "../models/group.model.mjs";
import RetroModel from "../models/retro.model.mjs";
import MemberModel from "../models/member.model.mjs";
import RetroBoardModel from "../models/board.model.mjs";
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
        if (!retroId)
            return res.status(404).json({ message: "Invalid path" });

        const fieldValidation = validateFields({ retroId });
        if (!fieldValidation.isValid)
            return res.status(400).json({ message: fieldValidation.message });

        const retro = await RetroModel.findById(retroId);
        if (!retro)
            return res.status(404).json({ message: "Invalid Path" });

        const group = await GroupModel.findById(retro.group);
        const members = await MemberModel.find({ group: group._id }).populate("user", "name email");
        const users = members.map(member => member.user._id);

        if (!users.map(id => id.toString()).includes(req.currentUser.toString())) {
            return res.status(404).json({ message: "Invalid Path" });
        }

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
        if (group.createdBy.toString() !== req.currentUser.toString())
            return res.status(403).json({ message: "You are not authorized to delete this retro" });

        await RetroBoardModel.deleteMany({ retroId: retroId });
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


// export retro to excel
const exportRetro = async (req, res, next) => {
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
        if (group.createdBy.toString() !== req.currentUser.toString())
            return res.status(401).json({ message: "You are not authorized to export this retro" });

        const retroData = await RetroBoardModel.findOne({ retroId: retroId });

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Retro Data");

        sheet.columns = [{ width: 45 }, { width: 45 }, { width: 45 }, { width: 45 }];

        const sheetHeader = `Retro Name: ${retro.name} [Group: ${group.name}] (Created on ${new Date(retro.createdAt).toLocaleString()})`;
        const hStyle = sheet.addRow([sheetHeader]);
        sheet.mergeCells(hStyle.number, 1, hStyle.number, 4);
        hStyle.alignment = { horizontal: "center", vertical: "middle" };
        hStyle.font = { bold: true, size: 18, color: { argb: "FF1565C0" } };
        hStyle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9EAD3" } };

        retroData?.moods?.forEach(mood => {
            const row = sheet.addRow([mood?.emoji, mood?.users.join(", ")]);
            row.getCell(1).font = { size: 21 };
            row.getCell(1).alignment = { wrapText: true, horizontal: "center", vertical: "middle" };
            row.getCell(2).alignment = { wrapText: true, vertical: "top" };
        });
        sheet.addRow([]);

        const headers = sheet.addRow(["Start Doing", "Stop Doing", "Continue Doing", "Appreciation"]);
        headers.eachCell(cell => {
            cell.font = { bold: true, size: 14 };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9EAD3" } };
            cell.alignment = { wrapText: true, horizontal: "center", vertical: "middle" };
        });

        const startDoing = retroData?.reviews?.startDoing || [];
        const stopDoing = retroData?.reviews?.stopDoing || [];
        const continueDoing = retroData?.reviews?.continueDoing || [];
        const appreciation = retroData?.reviews?.appreciation || [];

        const maxRows = Math.max(startDoing.length, stopDoing.length, continueDoing.length, appreciation.length);

        for (let i = 0; i < maxRows; i++) {
            const row = sheet.addRow([
                startDoing[i] ? `${startDoing[i].comment}\n~${startDoing[i].email}` : "",
                stopDoing[i] ? `${stopDoing[i].comment}\n~${stopDoing[i].email}` : "",
                continueDoing[i] ? `${continueDoing[i].comment}\n~${continueDoing[i].email}` : "",
                appreciation[i] ? `${appreciation[i].comment}\n~${appreciation[i].email}` : ""
            ]);
            row.eachCell(cell => { cell.alignment = { wrapText: true, vertical: "top", horizontal: "center" }; });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=retro_${retroId}.xlsx`);
        res.send(Buffer.from(buffer));

    } catch (error) {
        next(error);
    }
};



// exprting functions
export { createRetro, deleteRetro, completeRetro, getRetroData, exportRetro };
