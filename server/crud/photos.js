// db model
const photoModel = require('../models/photos');

async function checkPhoto(photo) {
    return new Promise((resolve, reject) => {
        photoModel.find({ id: photo.id })
            .then(response => {
                if (response.length == 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch(error => {
                console.log('error')
                reject(error);
            })
    })
}

async function storePhoto(selected) {
    let t = new photoModel();

    t.id = selected.id;
    t.author = selected.user.name;
    t.username = selected.user.username;
    t.description = selected.description;
    t.url = selected.urls.full;
    t.location = selected.location;

    t.save(function (err) {
        if (err) {
            console.log("Error saving to DB: ", err);
            return err;
        } else {
            console.log("Saved new photo to DB");
        }
    });
}

module.exports = {
    checkPhoto,
    storePhoto
}