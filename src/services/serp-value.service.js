const axios = require('axios');

const valueSerpApi = process.env.SERP_VALUE_API_KEY;

const getImages = async (query) => {
    const params = {
        api_key: valueSerpApi,
        search_type: "images",
        q: query,
        location: "spain",
        images_usage: "reuse_with_modification",
        images_Size: "large",
        time_period: "last_month",
        num: "10"
    };

    try {
        const response = await axios.get('https://api.valueserp.com/search', { params });
        const images = response.data.image_results;
        const links = [];

        images.forEach(image => {
            if (image.width > image.height) {
                links.push(image.image);
            }
        });
        
        return links.length > 0 ? links[0] : null;
    } catch (error) {
        console.error('Creacion imagen',error);
        return null; // En caso de error, retornar null
    }
};

module.exports = {
    getImages
};
