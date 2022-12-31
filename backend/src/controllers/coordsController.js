// push coordinates like -- http://localhost:8081/api/coords?id=golobog&lat=0.0001&lon=12.1212
// Get coordinates of known objects in response
// eslint-disable-line global-require
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')
const knownObjects  = require('./knownObjects')

require('firebase/firestore')

exports.getSetCoords = (async (req, res) => {
    // console.log( req.query );
    try {
        const docRef = await firestore().collection('entities').doc(req.query["id"])
        const doc = docRef.get()
        //console.log(docRef)
        docRef.update({
            coordinates: new firebaseAdmin.firestore.GeoPoint( Number(req.query["lat"]), Number(req.query["lon"]) ),
        })
        .then( () => {
            console.log( 'User ' + req.query["id"] + ' Coord: lat=' + req.query["lat"] + ', lon=' + req.query["lon"] )
        })
        // get and send coordinates for all known objects
        const coordList = await new knownObjects( docRef ).getKnownCoords();
        // console.log( coordList );
        res.send(coordList)
    } catch(err) {
        res.status(404)
        res.send('Error: ' + err)
    }
})
