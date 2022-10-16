const { getTasks } = require('../../controllers/tasksController')

const router = require('express').Router()

router.get('/tasks', getTasks)

module.exports = router