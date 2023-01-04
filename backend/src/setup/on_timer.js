// timer functions, system-wide
const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')
require('firebase/firestore')
const geolib = require('geolib');
const interact = require('../common/interact')

class on_timer {

    constructor( interval ) {
        this.interval = interval ? interval : 10000;
        this.loadingTimer = setInterval( this.intervalFunc.bind(this), interval );
        this.lastCalled = '';
        this.listObjectTypes = ['аномалия', 'тварь зоны', 'артефакт'];
        return this;
    }

    async intervalFunc() {
        console.log("ping...");
        await this.getLiveStalkerCoords(); // coordinates for alive stakers
        await this.getObjectCoords();      // coordinates for anomalies/artifacts/other objects of interaction
        await this.placeOnMap();           // put the points on map (fetch polygons for now)
        this.calculateInteractions();
        this.lastCalled = firebaseAdmin.firestore.FieldValue.serverTimestamp();
    }
    
    async getLiveStalkerCoords( ) {
        this.stalkerCoords = [];
        const entitiesRef = firestore().collection('entities');
        const snapshot = await entitiesRef.where('type', '==', 'сталкер' ).where('is_alive', '==', true).get();
        if( !snapshot.empty ) {
            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data());
                this.stalkerCoords.push( {id : doc.id, data : doc.data(), coordinates: { latitude: doc.data()["coordinates"]["_latitude"], longitude: doc.data()["coordinates"]["_longitude"]}} );
            });
        }
        // console.log( this.stalkerCoords );
    }
    
    async getObjectCoords() {
        this.objectCoords = [];
        const entitiesRef = firestore().collection('entities');
        const snapshot = await entitiesRef.where('type', 'in', this.listObjectTypes).get();
        if( !snapshot.empty ) {
            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data());
                this.objectCoords.push( {id : doc.id, data : doc.data(), coordinates: { latitude: doc.data()["coordinates"]["_latitude"], longitude: doc.data()["coordinates"]["_longitude"]}});
                                                                         // ^^^ poor man's conversion from geopoint to GeolibInputCoordinates
            });
        }
        // console.log( this.objectCoords );
        return true;
    }
    
    async placeOnMap () {
        // here we gather polygons if any
        for( const obj of this.objectCoords ) {
            // console.log( '"' + obj["id"] + '" -- ' + obj["data"]["type"] );
            if( obj["data"]["type"] == 'аномалия' ) {
              let polygon = [];
              // check if it has a polygon
                await firestore().collection('entities/' + obj["id"] + '/polygon').get()
                .then(snapshot => {
                    snapshot.forEach((point) => {
                        polygon.push({ latitude: point.data()["coordinate"]["_latitude"], longitude: point.data()["coordinate"]["_longitude"] });
                        // ^^^ poor man's conversion from geopoint to GeolibInputCoordinates
                        //console.log(point.data()["coordinate"])
                    })
                })
                .catch(err => {
                    // that is fine, a polygon can be empty
                })
                if( polygon.length ) { obj["polygon"] = polygon; }
            }
            // console.log( '"' + obj["id"] + '" -- ' + obj["polygon"] );
        }
        // console.log( this.objectCoords );
    }

    
    calculateInteractions() {
        for( const pers of this.stalkerCoords ) {
            if( pers["data"]["callsign"] ) { // to distinguish from NPC 
                for( const obj of this.objectCoords ) { // List all objects
                    let effect_done = false;
                    if( obj["polygon"] ) {
                        console.log( obj["id"] + ' crossing. ' + pers["id"] );
                        // console.log( pers["coordinates"] );
                        // console.log( obj["polygon"] );
                        if( obj["data"]["is_active"] && geolib.isPointInPolygon( pers["coordinates"], obj["polygon"] ) ) {
                            console.log('In area');
                            // calculating effect
                            if( !obj["data"]["damage_type"] )  { obj["data"]["damage_type"] = 'radiation'; }
                            if( !obj["data"]["damage_value"] ) { obj["data"]["damage_value"] = '0.1'; }
                            interact.interact( pers["id"], pers["data"], obj["data"], geolib.getDistance( pers["coordinates"], obj["coordinates"] ) );
                        } else {
                            console.log('Not In area');
                        }
                        effect_done = true; // 
                    } else {
                        console.log( obj["id"] + ' dist. ' + pers["id"] );
                    }
                    const dist = geolib.getDistance( pers["coordinates"], obj["coordinates"] ); // 1 meter accuracy
                    console.log( 'Disance is ' + dist );
                    if( dist <= ( obj["data"]["dist_detect"] ? obj["data"]["dist_detect"] : 10 ) ) {
                        interact.detect( pers["id"], obj["id"], obj["data"] );
                        // console.log( 'detected!' );
                    }
                    if(  obj["data"]["is_active"] && obj["data"]["damage_type"] && !effect_done ) {
                        if( dist <= ( obj["data"]["dist_effect"] ? obj["data"]["dist_effect"] : 10 ) ) {
                            // calculating damage done, if damage type 
                            interact.interact( pers["id"], pers["data"], obj["data"], dist );
                        }
                    }
                    if( dist <= 1 && obj["data"]["is_visible"] ) {
                        // you get to the center of anomaly, you know it now.
                        interact.knows( pers["id"], obj["id"] );
                    }
                } 
            
            } 
        }
    }
};

console.log( '>>' + new on_timer( 10000 ).lastCalled );

module.exports = on_timer;
