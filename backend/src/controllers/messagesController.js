const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

require('firebase/firestore')

exports.getMessages = (async (req, res) => {
    var callsign, faction
    try {
        const doc = await firestore().collection('entities').doc(req.query["id"]).get()
        if( doc.data()["callsign"] ) { callsign = doc.data()["callsign"] }
        faction  = doc.data()["faction"]
        console.log(callsign + ' ' + faction)
    } catch( error ) {
        res.status(400)
        res.send('Error: ' + error)
    }
    let messages = [] 
    await firestore().collection('messages').where("recipient", "in", [callsign,faction,"*"]).get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            messages.push(doc.data())
        })
        console.log(messages)
        res.send(messages)
    })
    .catch(err => {
        res.status(404)
        res.send(err + ' fail')
    })
})
