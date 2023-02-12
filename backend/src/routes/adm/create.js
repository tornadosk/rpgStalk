// Create a new stalker by id, callsign. faction
const { firestore } = require('../../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const checkIfAuthenticated = require('../../auth')

const router = require('express').Router();

// all stalkers are created at the entrance, which is, outsize of the Zone
mylat=42.016017
mylon=-72.553366

router.get('', async(req, res) => {
    // console.log( "admin creating a particular stalker" + req.query["id"]);
    if( req.query["id"] && req.query["callsign"] ) {
        mydata = { 
            'callsign'   : req.query["callsign"],
            'faction'    : req.query["faction"] ? req.query["faction"] : "Вольные",
            'health'     : 100,
            'damage_rad' : 0,
            'damage_tox' : 0,
            'is_alive'   : true,
            'resistence_rad' : 0,
            'resistence_tox' : 0,
            'medicines'      : 1,
            'medicines_rad'  : 1,
            'medicines_tox'  : 1,
            'coordinates': new firebaseAdmin.firestore.GeoPoint( mylat, mylon ),

        }
        firestore().collection('entities').doc(req.query["id"]).get()
        .then( doc => {
            if( doc.exists ) {
                res.status(400);
                res.send('Error: Stalker with that ID already exists');
            } else {
                const res0 = doc.ref.set(mydata);
                console.log( "New stalker created : " + mydata );
                res.send( mydata );
            }
        })
        .catch( err => {
            console.log( "Entity Update error: " + err )
            res.status(400)
            res.send('Error: ' + err)
        })
    } else {
        res.status(400);
        res.send('Error: use: /adm/create?id=XXXXX&callsign=YYYY&faction=ZZZZZ');
    }
});


module.exports = router;

