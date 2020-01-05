// db model
const photoModel = require('../models/photos');

async function checkPhoto(photo) {
    return new Promise((resolve, reject) => {
        patientModel.find({ id: photo })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            })
    })
}

async function storePhoto(selected) {
    let t = new photoModel();

    t.id = selected.id;
    t.author = selected.author;
    t.username = selected.username;
    t.description = selected.description;
    t.url = selected.url;
    t.location = selected.location;

    t.save(function (err) {
        if (err) {
            console.log("Error saving to DB: ", err);
            return err;
        } else {
            console.log("Saved new patient to DB");
        }
    });
}

module.exports = {
    checkPhoto,
    storePhoto
}