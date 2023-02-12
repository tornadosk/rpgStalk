// Send a message (POST request)
// such as: http://localhost:8081/api/send
// checks for recipients
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

const message = require('../common/message')

require('firebase/firestore')

//const express = require('express');
//const bodyParser = require('body-parser');
//const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));

exports.sendMessage = (async (req, res) => {
    const data = req.body;
    let sender = data.sender;        // if non-admin should be id
    let recipient = data.recipient;  // if non-admin, should be a callsign or 'faction' or '*'
    let text = data.text;
    let admin = data.admin;
    let success = false;             // record the sender search
    let search_rec = false;          // search for recipient if needed
    let result = '';                 // result
    let status = 200;                // HTTP response code
    try {
        // console.log(data);
        console.log('Trying message from:' + sender + ' to:' + recipient + ' "' + admin + '"');
        if( admin === 'true' ) {
            search_rec = false;
            success = true; // no checks
            status = 200;
            result = 'Message sent from "' + sender + '" to "' + recipient + '" (admin mode)';
        } else { // verification and more verification
            // first, get the record by ID (we need it for control and faction check)
            await firestore().collection('entities').doc(sender).get().then(function( thisDoc ) {
                if( thisDoc.exists) {
                    if( thisDoc.data()["is_alive"] ) {
                        if( thisDoc.data()["callsign"] ) { sender = thisDoc.data()["callsign"]; }
                        switch ( recipient ) {
                            case '*':  // sending to All
                                success = true;
                                break;
                            case 'faction': // sending to the Faction
                                success = true;
                                recipient = thisDoc.data()["faction"] ? thisDoc.data()["faction"] : "*";
                                break;
                            default:  // make the peer-to-peer send
                                search_rec = true;
                        }
                    } else {
                        success = false;
                        status = 400;
                        result = 'Sender "' + sender + '" is not alive!';

                    }
                } else {
                    success = false;
                    status = 404;
                    result = 'Sender "' + sender + '" does not exist!';
                }
            });
        }
        if( search_rec ) {
            // deep woodoo to convert the recipient to the first-uppercase-all-lowercase
            recipient = recipient.toLowerCase();
            recipient = recipient.charAt(0).toUpperCase() + recipient.slice(1);
            await firestore().collection('entities').where("callsign", "==", recipient).get()
            .then(snapshot => {
                snapshot.forEach((recDoc) => {
                    console.log( recDoc.data() );
                    if( recDoc.exists ) {
                        success = true;
                        status = 202;
                        result = 'Message sent from "' + sender + '" to "' + recipient + '" (peer-to-peer)';
                    } else {
                        success = false;
                        status = 404;
                        result = 'Recipient "' + recipient + '" does not exist!';
                    }
                });
            });
        }
        if( success ) {
            let msg = new message(sender, recipient, text);
            result = 'Message sent from "' + sender + '" to "' + recipient + '"';
            console.log('Message from: ' + sender + ' to:' + recipient);
        }
        res.status(status);
        res.send(result);
    } catch( error ) {
        res.status(400);
        res.send('Error: ' + error);
    }
})
