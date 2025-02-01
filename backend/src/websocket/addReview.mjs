import RetroBoardModel from "../models/board.model.mjs";

export async function addReview(retroId, data) {
    const { column, comment, email } = data;

    const updateResult = await RetroBoardModel.updateOne(
        { retroId },
        {
            $push: { [`reviews.${column}`]: { comment, email } }
        }
    );

    // Check if the update was successful
    if (updateResult.matchedCount === 0) {
        console.log("No document matched the given retroId:", retroId);
        return null;
    }

    const retroData = await RetroBoardModel.findOne({ retroId });
    console.log("Add Review:", retroData.reviews);
    return retroData.reviews;
}
