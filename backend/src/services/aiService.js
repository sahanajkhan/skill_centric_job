
const axios = require("axios");

const getRecommendations = async (userId) => {
    try {
        const response = await axios.post(
            `${process.env.AI_SERVICE_URL}/recommendations`,
            {
                userId
            }
        );

        return response.data;
    } catch (error) {
        throw new Error(
            "AI recommendation service is currently unavailable"
        );
    }
};

module.exports = {
    getRecommendations
};

