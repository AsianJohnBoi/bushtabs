const slack = require("slack");

async function sendMessage(msg) {
    slack.chat.postMessage({
        token: process.env.SLACK_TOKEN, 
        channel: process.env.SLACK_CHANNEL, 
        text: msg
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    })
}

module.exports = {
    sendMessage
}