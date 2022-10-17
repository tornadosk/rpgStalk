# rpgStalk

You will need Node as first point. please install from
https://nodejs.org/en/ LTC is fine

Next you need NPM (not recommending YARN for this case)
npm install [<@scope>/]<name> to avoid challenges install -g globally

Both folders requires separate 'npm install' to bring node_modules

For backend after succesfull packages install copy firebase_config into src folder or set as global env, or hide into local env file:
update db.js file at 2:1 const ~~ require('.<your_firebase_connfig.json>')

in the console run: npm run start
Your server will open at :8081 by default, adjust port at bottom of app.js or at .env if needed.

For frontend follow instractions inside of frontend folder >>> README.md
for run after dependencies are pulled
-> npm install -g @quasar/cli
-> quasar dev
