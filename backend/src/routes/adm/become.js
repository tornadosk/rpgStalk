// 'switches' the UID from one to another entity, allowing to become a Zone Creature, for instance
// http://localhost:8081/adm/become?from=golobog&to=swampdoctor
const { firestore } = require('../../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const checkIfAuthenticated = require('../../auth')

const router = require('express').Router();

router.get('', async(req, res) => {
    if( req.query["from"] && req.query["to"] ) {
        console.log( "Switching character: from '" + req.query["from"] + "' to '" + req.query["to"] + "'" );
        firestore().collection('entities').doc(req.query["from"]).get()
        .then( doc_from => {
            if( doc_from.exists ) {
                firestore().collection('entities').doc(req.query["to"]).get()
                .then( doc_to => {
                    if( doc_to.exists ) {
                        let my_id = doc_from.data()["uid"];
                        doc_from.ref.update({
                            uid : '',
                        });
                        doc_to.ref.update({
                            uid : my_id,
                        })
                        .then( function() {
                            res.send(doc_to.data());
                        });
                    } else {
                        res.status(400);
                        res.send('Become: DB cannot find Target ID ' + req.query["to"]);
                    }
                });
            } else {
                res.status(400);
                res.send('Become: DB cannot find Source ID ' + req.query["from"]);
            }
        })
        .catch(err => {
            res.status(400);
            res.send('Become: DB update failed for ' + req.query["from"] + ' : ' + err);
        })
    } else { // if rec.query...
        res.status(400);
        res.send('Become: incorrect form, should be /adm/become?from=from_id&to=to_id' );
    }
});

module.exports = router;