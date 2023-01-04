import db from '../db.js';

// property reader
import PropertiesReader from 'properties-reader';
//const { PropertiesReader } = pkg;

var properties = PropertiesReader('backend.properties');

var userID = properties.get("id");
if( !userID ) {
  console.log( "Invalid property file, no property file or callsign not defined" );
  process.exit(1);
} 

console.log("Fetching data for '" + userID + "'" );
// DB get data for the current user

var Callsign = '';
var IsAlive = false;
var Faction = '';

import { collection } from "firebase/firestore";

await db.firestore().collection("entities").get().then(snapshot => {
    snapshot.forEach((doc) => {
//        console.log("'" + doc.id + "'");
        if(doc.id == userID) {
//            console.log(doc.data());
            Callsign = doc.data()["callsign"];
            IsAlive = doc.data()["is_alive"];
            Faction = doc.data()["faction"];
        }
    })
})
.catch(err => {
    console.log(err + ' fail')
})

if( Callsign ) {
  console.log( "Dobro pozhalovat' v Zonu, " + Callsign );
} else {
  console.log("No user data found in the DB" );
  process.exit(1);
}
