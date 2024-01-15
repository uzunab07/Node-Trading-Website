const express = require('express')
const controller = require('../controllers/controller')
const {isGuest,isLoggedIn,isAuthor} = require('../middlewares/auth')
const {isValidId} = require('../middlewares/validator');

const router = express.Router();

// GET /cars : send all the cars to the user

router.get('/',controller.index)

// GET /cars/new send the html form for the new car

router.get('/new', isLoggedIn,controller.new)

//POST /cars creat a new car

router.post('/',isLoggedIn, controller.create)

// GET /cars/:id cars identify by id
router.get('/:id',isValidId,controller.show)

router.get('/:id/edit',isValidId,isLoggedIn,isAuthor,controller.edit)

router.put('/:id',isValidId,isLoggedIn,isAuthor,controller.update)

router.delete('/:id',isValidId,isLoggedIn,isAuthor,controller.delete)



module.exports =  router;