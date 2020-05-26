const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

//exports.helloWorld = functions.https.onRequest((request, response) => { response.send("Hello from Firebase.....!");

//});
exports.SendNotifications = functions.database.ref(`/Technician/Tokens/{uid}/`).onCreate((snapshot, context) => {
    const token = snapshot.val();
    console.log("Uppercasing", context.params.uid, token);
    var message = {
        data: {
            notifications: welcome
        },
        token: token
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return null;
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
});