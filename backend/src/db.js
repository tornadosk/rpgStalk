const admin = require('firebase-admin')
const serviceAccount = require('../env/stalkerrpggame-firebase-adminsdk-z1iot-a3d4dd0c8d.json')

const db = admin.initializeApp({
    credentials: admin.credential.cert(serviceAccount)
})

module.exports = db