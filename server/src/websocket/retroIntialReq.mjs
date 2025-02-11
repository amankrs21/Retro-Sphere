import RetroBoardModel from "../models/board.model.mjs"

// function to retrieve or create retro board data
export async function retroIntialReq(retroId) {

    let retroData = await RetroBoardModel.findOne({ retroId: retroId });
    if (!retroData) {
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
