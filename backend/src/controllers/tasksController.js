const database = require('../db')

const db = database.firestore()

exports.getTasks = (async (req, res) => {
    let tasks = [] 
    await db.collection('tasks').get()
    .then(snapshot => {
        snapshot.forEach((doc) => {
            tasks.push(doc.data())
        })
        console.log(tasks)
        res.send(tasks)
    })
    .catch(err => {
        res.status(404)
        res.send(err + ' fail')
    })
})
