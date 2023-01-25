// /adm/list&search=сталкер
// List entities of specific type (alive and not, active or not, visible or not) /adm/list
const { firestore } = require('../../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const checkIfAuthenticated = require('../../auth')

const router = require('express').Router();

router.get('', async(req, res) => {
    // console.log( "admin listing things" );
    let things = [];
    let criteria = req.query["search"] ? req.query["search"] : "сталкер";
    await firestore().collection('entities').where("type", "==", criteria).get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            things.push({id : doc.id, data: doc.data()});
        })
        // console.log(things)
        res.send(things)
    })
    .catch(err => {
        res.status(404)
        res.send(err + ' fail')
    })
    
});

module.exports = router;