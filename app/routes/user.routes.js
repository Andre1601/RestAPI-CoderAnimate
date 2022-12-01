module.exports = (app) => {
    const user = require('../controllers/user.controller')
    const router = require('express').Router()
    const verifyToken = require("../routes/verifyToken");


    router.get('/', user.findAll)
    router.get('/me', verifyToken, user.findMe)
    router.post('/register', user.register)
    router.post('/login', user.login)
    router.get('/:id', user.findOne)
    router.put('/update/:id', user.update)

    app.use('/user', router) 
}