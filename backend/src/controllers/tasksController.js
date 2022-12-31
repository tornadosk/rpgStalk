const { firestore } = require('../db')

exports.getTasks = (async (req, res) => {
    let tasks = [] 
    await firestore().collection('tasks').get()
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
