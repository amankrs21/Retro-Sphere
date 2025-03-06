import { santizeId } from "../utils/validate.mjs";
import RetroModel from "../models/retro.model.mjs";
import RetroBoardModel from "../models/board.model.mjs";


// function to retrieve or create retro board data
export async function retroIntialReq(retroId) {

    let retroData = await RetroBoardModel.findOne({ retroId: retroId });
    if (!retroData) {
        let santizeRetroId = santizeId(retroId);
        if (!santizeRetroId) return null;
        const isRetroExist = await RetroModel.findById(retroId);
        if (!isRetroExist) return null;

        retroData = new RetroBoardModel({
            retroId: retroId,
            moods: [
                { emoji: '😡', users: [] },
                { emoji: '😠', users: [] },
                { emoji: '😐', users: [] },
                { emoji: '🙂', users: [] },
                { emoji: '🤩', users: [] }
            ],
            reviews: {
                startDoing: [],
                stopDoing: [],
                continueDoing: [],
                appreciation: [],
            },
        });
        await retroData.save();
    }

    return retroData;
}
