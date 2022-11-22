module.exports = (app) => {
    const user = require('../controllers/user.controller')
    const router = require('express').Router()

    router.post('/create', user.create)
    router.get('/:id', user.findOne)
    router.put('/update/:id', user.update)

    app.use('/api/user', router) 
}