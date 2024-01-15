const express = require('express')
const controller = require('../controllers/userController')
const {isGuest,isLoggedIn} = require('../middlewares/auth');
const { isValidId } = require('../middlewares/validator');

const router = express.Router();


router.get('/new',isGuest, controller.new);

router.post('/',isGuest,controller.create)

router.get('/login',isGuest,controller.getUserLogin)

router.post('/login',isGuest,controller.login)

router.get('/profile',isLoggedIn, controller.profile)

router.get('/logout', isLoggedIn,controller.logout)


router.post('/:id/profile',isLoggedIn,isValidId,controller.addFav)

router.delete('/:id',isLoggedIn,isValidId,controller.removeFav)


router.post('/trade/:id',isLoggedIn,isValidId,controller.InitTrade)


router.post('/trades',isLoggedIn,controller.trade)

router.delete('/offer/:id',isLoggedIn,isValidId,controller.deleteOffer)

router.post('/offer/:id',isLoggedIn,isValidId,controller.offer)

router.post('/:id/done',isLoggedIn,isValidId,controller.TradeDone)





module.exports = router;