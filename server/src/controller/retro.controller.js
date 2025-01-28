const { retroJson } = require('../models/retro.json');

const retroDataModel = (req, res) => {
    try {
        // const retroJSON = retroJson;
        res.status(200).json(retroJson);
    } catch (error) {
        console.error('Error in retroDataModel:', error);
        res.status(400).json({ error: 'Error in retroDataModel' });
    }
};

module.exports = { retroDataModel };
