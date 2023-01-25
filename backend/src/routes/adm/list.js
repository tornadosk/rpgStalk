const { firestore } = require('../../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const checkIfAuthenticated = require('../../auth')

const router = require('express').Router();

router.get('', async(req, res) => {
    // console.log( "admin listing stalkers" );
    let stalkers = [];
    await firestore().collection('entities').where("type", "==", "сталкер").get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            stalkers.push({id : doc.id, data: doc.data()});
        })
        // console.log(stalkers)
        res.send(stalkers)
    })
    .catch(err => {
        res.status(404)
        res.send(err + ' fail')
    })
    
});

module.exports = router;