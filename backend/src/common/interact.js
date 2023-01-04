const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')
const message = require ('./message')
const knownObjects = require ('./knownObjects')

require('firebase/firestore')

const detect = ( stalker_id, effector_id, effector_data ) => { 
    // stalker_id and effector_id is a document id in Firebase. Effector_data is a snapshot of document datf for artifact-anomaly-whatever
    if( effector_data["is_visible"] ) {
        console.log( stalker_id + ' DETECTED ' + effector_id + ' at ' + effector_data["coordinates"]["_latitude"] + ':' +  effector_data["coordinates"]["_longitude"]);
        // notify stalker about detection
    } else {
        console.log( stalker_id + " doesn't see " + effector_id + ' at ' + effector_data["coordinates"]["_latitude"] + ':' +  effector_data["coordinates"]["_longitude"]);
    }
    // notify the effector (anomaly etc) about detection
}

const interact = ( stalker_id, stalker_data, effector_data, distance ) => { 
    // stalker_id is a document id in Firebase. Effector_data is a snapshot of document data for artifact-anomaly-whatever, distance is in meters
    console.log( stalker_id + ' AFFECTED BY ' + effector_data["type"] + ' with ' +  effector_data["damage_type"] + '(' +  effector_data["damage_value"] + ')');
    console.log( effector_data );
    // change stalker's health and other properties based on the effector 
    const damage_value = effector_data["damage_value"] ? effector_data["damage_value"] : 1;
    const damage_formula = effector_data["damage_formula"] ? effector_data["damage_formula"] : 'damage_value';
    switch( effector_data["damage_type"] ) {
        case 'radiation' :
            // first calculate the level
            let levelr = eval( damage_formula );
            // and send it to PDA ???
            // then apply defense
            const resistencer = stalker_data["resistence_rad"] ? stalker_data["resistence_rad"] : 0;
            let effectr = levelr * (1 - resistencer);
            console.log( stalker_id + ' felt ' + levelr + ' in radiation, resulting in ' + effectr + ' damage ' );
            // and change the DB
            hit( stalker_id, effectr, 0, 0 );
            break;
        case 'toxic' :
            // first calculate the level
            let levelt = eval( damage_formula );
            // and send it to PDA ???
            // then apply defense
            const resistencet = stalker_data["resistence_tox"] ? stalker_data["resistence_tox"] : 0;
            let effectt = levelt * (1 - resistencet);
            console.log( stalker_id + ' felt ' + levelt + ' in poison, resulting in ' + effectt + ' damage ' );
            // and change the DB
            hit( stalker_id, 0, effectt, 0 );
            break;
        case 'physical' :
            let levelp = eval( damage_formula );
            console.log( stalker_id + ' received ' + levelp + 'physical damage' );
            // and change the DB
            hit( stalker_id, 0, 0, levelp );
            break;
        default:
    }
    // notify stalker about changes
}

const hit = async( stalker_id, effect_rad, effect_tox, effect_phys ) => {
    // get object
    let health = 0;
    let docSnap = await firestore().collection('entities').doc(stalker_id)
    await docSnap.get().then(function( thisDoc ) {
        if( thisDoc.exists) {
            new_health = thisDoc.data()["health"];
            level_rad = thisDoc.data()["damage_rad"] + effect_rad;
            level_tox = thisDoc.data()["damage_tox"] + effect_tox;
            if( level_rad > 20 ) { level_rad = 20; }
            if( level_tox > 20 ) { level_tox = 20; }
            new_health -= (level_rad + level_tox + effect_phys);
            let new_is_alive = true;
            if( new_health <= 0 ) {
                new_health = 0;
                new_is_alive = false;
                const rip = new message('база', '*', 'Сталкер ' + thisDoc.data()["callsign"] + ' погиб в Зоне')
            }
            const res = docSnap.update({
                health   : new_health,
                is_alive : new_is_alive,
                damage_rad : level_rad,
                damage_tox : level_tox,
            })
        }
    });

    // apply effects
    // calculate physical damage
    // if dead, act
    
}


const knows = async( stalker_id, effector_id ) => {
    // stalker_id and effector_id is a document id in Firebase. NO check for is_visible attribute (it should be done upstream if needed)
    const stalker = new knownObjects(stalker_id);
    const known_list = await stalker.getKnownEntities();
    console.log( known_list );
    if( known_list ) {
        if( known_list.includes( effector_id ) ) {
            console.log( stalker_id + ' knows already ' + effector_id );
            return;
        }
    }
    stalker.addKnownEntity( effector_id );
    console.log( stalker_id + ' NOW KNOWS ' + effector_id );
    // Notification here!!!
    
}

const deactivate = ( object_id ) => { // set visibility flag to false
}

exports.detect = detect;
exports.interact = interact;
exports.knows = knows;
exports.deactivate = deactivate;
