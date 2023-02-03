// hit -- http://localhost:8081/api/health?id=golobog&hit=1
// get back health points, radiation/toxic levels, counts of medicines
// I'm hit - big red button
// 
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')
const interact = require('../common/interact')

require('firebase/firestore')

// Attention!! Hardcoded values for effect of single hit (knife, pistol)
const phys_hit_effect = 33

exports.getHit = (async (req, res) => {
    console.log( req.query );
    try {
        let newh = {};
        let effect = phys_hit_effect * (req.query["hit"] ? req.query["hit"] : 1);
        newh = await interact.hit( req.query["id"], 0, 0, effect ); // returning map
        if( newh ) {
            firestore().collection('entities').doc(req.query["id"]).get()
            .then( doc => {
                var newdoc = doc.data();
                newdoc["health"] = newh["health"];
                newdoc["is_alive"] = newh["is_alive"];
                res.send(newdoc);
                console.log( 'User ' + req.query["id"] + ' Hit!' );
            })
        }
    } catch(err) {
        res.status(404)
        res.send('Error: ' + err)
    }
})
