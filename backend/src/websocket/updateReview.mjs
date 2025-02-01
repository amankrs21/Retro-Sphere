import RetroBoardModel from "../models/board.model.mjs";

export async function updateReview(retroId, data) {
    const { column, comment, email, index } = data;

    // check that email should be same as the one who added the review
    const preData = await RetroBoardModel.findOne({ retroId });
    if (preData.reviews[column][index].email !== email) {
        console.log("Email does not match the one who added the review");
        return null;
    }

    const updateResult = await RetroBoardModel.updateOne(
        { retroId },
        {
            $set: { [`reviews.${column}.${index}`]: { comment, email } }
        }
    );

    // Check if the update was successful
    if (updateResult.matchedCount === 0) {
        console.log("No document matched the given retroId:", retroId);
        return null;
    }

    const postData = await RetroBoardModel.findOne({ retroId });
    console.log("Updated Review:", postData.reviews);
    return postData.reviews;
}
