const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const checkIfAuthenticated = require('./auth')
const app = express()

app.use(morgan('combined'))
app.use(bodyparser.json())
app.use(cors())


app.use(function(req, res, next) {
    if (req.originalUrl === 'some.web.ifneedraw') {
        app.use(express.raw())
        next();
      } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    }
})


app.use(require('./routes'));

const { admin, firestore } = require('./db')

console.log('hello');

const setup = import('./setup/index.js');

app.get('/status', (req, res) => {
    res.send({
        message: 'status is fine'
    })
})

app.listen(process.env.PORT || 8081);