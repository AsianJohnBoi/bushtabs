const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const photoSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    author: {
        type: String
    },
    username: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    location: {
        type: Object
    }
});

module.exports = mongoose.model('photos', photoSchema);