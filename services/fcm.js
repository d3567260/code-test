const admin = require("firebase-admin");
const serviceAccount = require("./../serviceAccountKey.json");
const { getMessaging } = require("firebase-admin/messaging");

class FCMService {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    async send(registrationToken, data) {
        const message = {
            token: registrationToken,
            data
        };

        await getMessaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }
}

module.exports = FCMService;
