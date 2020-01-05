const axios = require('axios');

async function getPictures() {
    axios({
        method: 'get',
        url: `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_TOKEN}&query=australia&count=1&featured=true&orientation=landscape`
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        return error;
    });
}

module.exports = { getPictures };
