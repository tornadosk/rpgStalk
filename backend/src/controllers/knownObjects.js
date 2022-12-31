const { firestore } = require('../db')
const firebaseAdmin = require('firebase-admin')

require('firebase/firestore')

class knownObjects {

    constructor( id ) { 
        this.id = id;
        this.docSnap = '';
        this.coordList = [];
        // getDocumentSnapshot();
     }

    async getDocumentSnapshot( ) {
        if( !this.docSnap ) { //makes sense for the 1st call only
            switch( typeof this.id ) {
                case 'string':
                    // id is a string, find a database entry first
                    this.docSnap = await firestore().collection('entities').doc(this.id)
                    await this.docSnap.get().then(function(thisDoc) {
                        if( !thisDoc.exists) { 
                            this.docSnap = '';
                        }
                    });
                    break;
                case 'object' : 
                    // id is NOT a string, return its value hoping it's a document
                    this.docSnap = this.id;
                    var thisDoc = await this.docSnap.get();
                    if( thisDoc.exists) { this.id = thisDoc.id } else {this.id = ''}
                    break;
                default: console.log( "can't get list of known objects for " + typeof this.id + ' : ' + this.id );
            }
        }
        return this.docSnap;
    }

    async getKnownEntities( ) {
        this.knownList = [];
        const doc = await this.getDocumentSnapshot()
        // console.log('entities/'+ this.id + '/knows');
        await firestore().collection('entities/'+ this.id + '/knows').get()
        .then(snapshot => {
            snapshot.forEach((known) => {
                this.knownList.push(known.id)
            })
        })
        .catch(err => {
            // that is fine, a list of known things can be empty
        })
        // console.log(this.knownList)
        return this.knownList;
        
    }

    // return type, name (or subtype), center coordinate or array of coordinates
    // WARNING !!! Some hardcoded formattin goes here!!!
    async getKnownCoords( displayIDs ) {
        var coordList = [];
        var anomalyList = []; // special case, we need one more level of search
        var arrayList = await this.getKnownEntities()
        await firestore().collection('entities').get()
        .then(snapshot => {
            snapshot.forEach((doc) => {
                if( arrayList.includes(doc.id ) ) {
                    // console.log(doc.id + ': ' + doc.data()["type"]);
                    switch ( doc.data()["type"] ) {
                    case "сталкер" :
                        coordList.push({"type" : "сталкер", "name": doc.data()["callsign"], "is_alive": doc.data()["is_alive"], "coordinates": doc.data()["coordinates"]});
                        break;
                    case "аномалия" :
                        if( doc.data()["is_visible"] ) {
                            anomalyList.push( {id: doc.id, data: doc.data()} );
                        }
                        break;
                    case "артефакт" :
                        if( doc.data()["is_visible"] ) {
                            coordList.push({"type" : "артефакт", "name": doc.data()["subtype"], "coordinates": doc.data()["coordinates"]});
                        }
                        break;
                    case "тварь зоны" :
                        if( doc.data()["is_visible"] ) {
                        }
                        break;
                    default:
                        coordList.push({"type" : "фигня", "name": "непонятное", "coordinates": doc.data()["coordinates"]});
                    }
                }
            });
        });
        // fetch the polygon
        for( const anomaly of anomalyList ) {
            var polygon = [];
            console.log( anomaly["id"] );
            await firestore().collection('entities/' + anomaly["id"] + '/polygon').get()
            .then(snapshot => {
                snapshot.forEach((point) => {
                    polygon.push(point.data()["coordinate"])
                })
            })
            .catch(err => {
                // that is fine, a polygon can be empty
            })
            coordList.push({"type" : "аномалия", "name": anomaly["data"]["subtype"], "coordinates": anomaly["data"]["coordinates"], "polygon": polygon});
        }
        // console.log( coordList );
        return coordList;
    }
};

// console.log( new knownObjects("golobog").getKnownCoords() );

module.exports = knownObjects;
