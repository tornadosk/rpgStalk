const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')
const {v4:uuidv4} = require('uuid')
require('firebase/firestore')

class message {

    constructor( sender, recipient, text ) {
        this.data = { 
            'sender'    : sender,
            'recipient' : recipient,
            'message'   : text,
            'recipient_read' : false,
            'id'             : uuidv4()
        }
        // checks for sender, recipient, text, whatever
        this.send();
     }
     
     async send() {
        const newMsgRef = firestore().collection('messages').doc();
        const res0 = await newMsgRef.set(this.data);
        const res1 = await newMsgRef.update({
            timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });
        console.log( "Message : " + this.data );
     }

}

// const msg = new message( "база", "база", "проверка связи" );

module.exports = message;

