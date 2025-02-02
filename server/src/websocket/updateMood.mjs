import RetroBoardModel from "../models/board.model.mjs";

export async function updateMood(retroId, data) {
    const { emoji, email } = data;

    await RetroBoardModel.updateOne(
        { retroId },
        [
            {
                $set: {
                    moods: {
                        $map: {
                            input: "$moods",
                            as: "mood",
                            in: {
                                $cond: [
                                    { $eq: ["$$mood.emoji", emoji] },
                                    {
                                        $mergeObjects: [
                                            "$$mood",
                                            { users: { $concatArrays: ["$$mood.users", [email]] } }
                                        ]
                                    },
                                    {
                                        $mergeObjects: [
                                            "$$mood",
                                            {
                                                users: {
                                                    $filter: {
                                                        input: "$$mood.users",
                                                        cond: { $ne: ["$$this", email] }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ]
    );

    const retroData = await RetroBoardModel.findOne({ retroId });
    console.log("Updated Emoji:", retroData.moods);
    return retroData.moods;
}
