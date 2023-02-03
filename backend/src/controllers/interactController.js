// interaction request like -- http://localhost:8081/api/interact?id=golobog&ble_id=0DEAFBEEF0&rss=104
// Interaction with BLE-only objects of unknown coordinates (such as, not-so-smart artifacts).
// 
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

require('firebase/firestore')

exports.getInteraction = (async (req, res) => {
    console.log( req.query );
    try {
        firestore().collection('entities').doc(req.query["id"]).get()
        .then( doc => {
            if( doc.exists ) {
            }
        })
        .then( () => {
            console.log( 'User ' + req.query["id"] + ' Interaction' );
        })
    } catch(err) {
        res.status(404)
        res.send('Error: ' + err)
    }
})
