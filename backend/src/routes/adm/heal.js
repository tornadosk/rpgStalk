// Healing URL. Removes radiation and toxic damage from a given id, returns health to the maximum
// http://localhost:8081/adm/heal?id=golobog
const { firestore } = require('../../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const checkIfAuthenticated = require('../../auth')

const router = require('express').Router();

router.get('', async(req, res) => {
    // console.log( "admin healing a particular stalker" + req.id);
    firestore().collection('entities').doc(req.query["id"]).get()
    .then( doc => {
        if( doc.exists ) {
            doc.ref.update({
                health: 100,
                damage_rad: 0,
                damage_tox: 0,
            })
            .then( function() {
                res.send(doc.data());
            });
        }
    })
    .catch(err => {
        res.status(404);
        res.send('Heal: DB update failed for ' + req.query["id"] + ' : ' + err);
    })
    
});

module.exports = router;