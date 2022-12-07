module.exports = (app) => {
    const user = require('../controllers/user.controller')
    const router = require('express').Router()
    const verifyToken = require("../routes/verifyToken");


    router.get('/', user.findAll)
    router.get('/me', verifyToken, user.findMe)
    router.post('/register', user.register)
    router.post('/login', user.login)
    router.get('/:id', user.findOne)
    router.get('/getuser/:id', user.findUser)
    router.put('/update/general', verifyToken, user.updateGeneral)
    router.put('/update/edit', verifyToken, user.updateProfile)
    router.put('/verify', verifyToken, user.verifyPassword)
    router.put('/update/password', verifyToken, user.updatePassword)
    router.put('/update/social', verifyToken, user.updateSocial)
    router.put('/follow/:id', verifyToken, user.following)

    
    app.use('/user', router) 
}