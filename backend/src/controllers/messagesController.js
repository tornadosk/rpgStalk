// Read messages and update (if set) the read flag
// such as: http://localhost:8081/api/messages?id=golobog&recipient=self&only_new=true
// if recipient=self, messages for faction and * are not shown
// if only_new=true then messages with recipient_read=false are shown and then flag updated to true in base
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

const message = require('../common/message')

require('firebase/firestore')

exports.getMessages = (async (req, res) => {
    var callsign, faction
    try {
        const doc = await firestore().collection('entities').doc(req.query["id"]).get()
        if( doc.data()["callsign"] ) { callsign = doc.data()["callsign"] }
        faction  = doc.data()["faction"]
        // console.log(callsign + ' ' + faction)
    } catch( error ) {
        res.status(400)
        res.send('Error: ' + error)
    }
    let messages = [];
    let condition = [callsign,faction,"*"];
    if( req.query["recipient"] == 'self' ) { condition = [callsign]; } // to filter out only direct messages
    await firestore().collection('messages').where("recipient", "in", condition).get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            if( req.query["only_new"] ) {       // if we explicitly defined &only_new=true
                if(  doc.data()["recipient_read"] ) { // this message had been read already
                } else {
                    messages.push(doc.data());
                    doc.ref.update({
                        recipient_read : true,
                    })
                    .catch( err => {
                        console.log( "Entity Update error: " + err )
                        res.status(400)
                        res.send('Error: ' + err)
                    })
                }
            } else { 
                messages.push(doc.data());
                // no update logic here
            }
        })
        // console.log(messages)
        res.send(messages)
    })
    .catch(err => {
        res.status(404)
        res.send( 'Error reading messages: ' + err)
    })
})
