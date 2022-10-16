const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
// const db = require('./db')

const apP = express()

apP.use(morgan('combined'))
apP.use(bodyparser.json())
apP.use(cors())


// apP.use(require('./routes'))
const admin = require('firebase-admin')
const serviceAccount = require('../env/stalkerrpggame-firebase-adminsdk-z1iot-a3d4dd0c8d')

const db = admin.initializeApp({
    credentials: admin.credential.cert(serviceAccount)
})


console.log('hello')

apP.get('/tasks', async (req, res) => {
    console.log('entered')
    let tasks = []
    await db.firestore().collection('tasks').get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            tasks.push(doc.data())
        })
        console.log(tasks)
        res.send(tasks)
    })
    .catch(err => {
        console.log(err)
        res.status(404).send(err + ' fail')
    })
})

apP.get('/status', (req, res) => {
    res.send({
        message: 'status is fine'
    })
})

apP.listen(process.env.PORT || 8081)