const axios = require('axios');
const AWS = require('aws-sdk');
const crudPhoto = require('../crud/photos');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

async function getPictures() {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_TOKEN}&query=australia&count=2&orientation=landscape`
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    })
}

async function selectNewPhoto() {
    var found = false;
    var selectedPhoto = '';

    try {
        while (!found) {
            // Get a picture
            var data = await getPictures();

            // Check if photo has been used
            for (var i = 0; i < data.length; i++) {
                var exists = await crudPhoto.checkPhoto(data[i]);
                if (!exists) {
                    selectedPhoto = data[i];
                }
            }
            if (selectedPhoto != null) {
                // store new photo in db
                await crudPhoto.storePhoto(selectedPhoto);

                axios.get(selectedPhoto.urls.full, {
                    responseType: 'arraybuffer'
                }).then(response => {
                    const buffer = Buffer.from(response.data);
                    var s3 = new AWS.S3();
                    var params = {
                        Body: buffer,
                        Bucket: 'bushtabs',
                        Key: "images/background.jpg",
                        ACL: 'public-read'
                    }
                    s3.putObject(params, function (err, data) {
                        if (err) throw new Error('Error Occurred', err.stack);
                        console.log(`Uploaded new photo: ${selectedPhoto.urls.full}`, data);
                    })
                })

                found = true;
            }
        }
    } catch (e) {
        throw new Error('Error Occurred', e);
    }
}

module.exports = {
    getPictures,
    selectNewPhoto
};
