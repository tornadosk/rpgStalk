// health request like -- http://localhost:8081/api/health?id=golobog&heal_phys=1&heal_rad=1&heal_tox=1
// get back health points, radiation/toxic levels, counts of medicines
// eslint-disable-line global-require
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

require('firebase/firestore')

// Attention!! Hardcoded values for effect of various medicines and maximum health
const phys_health_effect = 20
const rad_health_effect  = 2
const tox_health_effect  = 2
const max_health = 100

exports.getSetHealth = (async (req, res) => {
    console.log( req.query );
    try {
        firestore().collection('entities').doc(req.query["id"]).get()
        .then( doc => {
            if( doc.exists ) {
                var new_health = doc.data()["health"]
                var new_medicines = doc.data()["medicines"]
                if( req.query["heal_phys"] ) {
                    if( (new_medicines > 0) && (doc.data()["health"] < max_health) ) {
                        new_health = Number( req.query["heal_phys"] ) * phys_health_effect + new_health
                        if( new_health > max_health ) { new_health = max_health }
                        new_medicines -= req.query["heal_phys"]
                    }
                }
                var new_damage_rad = doc.data()["damage_rad"]
                var new_medicines_rad = doc.data()["medicines_rad"]
                if( req.query["heal_rad"] ) {
                    if( (new_medicines_rad >= req.query["heal_rad"]) && (doc.data()["damage_rad"] > 0) ) {
                        new_damage_rad -= Number( req.query["heal_rad"] ) * rad_health_effect
                        if( new_damage_rad < 0 ) { new_damage_rad = 0 }
                        new_medicines_rad -= req.query["heal_rad"]
                    }
                }
                var new_damage_tox = doc.data()["damage_tox"]
                var new_medicines_tox = doc.data()["medicines_tox"]
                if( req.query["heal_tox"] ) {
                    if( (new_medicines_tox >= req.query["heal_tox"]) && (doc.data()["damage_tox"] > 0) ) {
                        new_damage_tox -= Number( req.query["heal_tox"] ) * tox_health_effect
                        if( new_damage_tox < 0 ) { new_damage_tox = 0 }
                        new_medicines_tox -= req.query["heal_tox"]
                    }
                }
                // Here's a DIRTY HACK due to the async character of update. We're updating a JSON copy of the document
                var newdoc = doc.data()
                newdoc["health"] = new_health
                newdoc["medicines"] = new_medicines
                newdoc["damage_rad"] = new_damage_rad
                newdoc["medicines_rad"] = new_medicines_rad
                newdoc["damage_tox"] = new_damage_tox
                newdoc["medicines_tox"] = new_medicines_tox
                // End of that
                doc.ref.update({
                    health: new_health,
                    medicines: new_medicines,
                    damage_rad: new_damage_rad,
                    medicines_rad: new_medicines_rad,
                    damage_tox: new_damage_tox,
                    medicines_tox: new_medicines_tox,
                })
                .then( function() {
                    res.send(newdoc)
                    console.log(newdoc)
                    console.log( 'User ' + req.query["id"] + ' Health: ' + new_health + ', medicines: ' + new_medicines + 'Rad: ' + new_damage_rad + ':' + new_medicines_rad + 'Tox: ' + new_damage_tox + ':' + new_medicines_tox )
                })
                .catch( err => { 
                    console.log( "Entity Update error: " + err )
                    res.status(400)
                    res.send('Error: ' + err)
                })
            }
        })
        .then( () => {
            console.log( 'User ' + req.query["id"] + ' Health' );
        })
    } catch(err) {
        res.status(404)
        res.send('Error: ' + err)
    }
})
