const router = require('express').Router();

const userRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controlers/users');

const validation = require('../middlewares/validation');

router.post('/signin', validation.login, login);
router.post('/signup', validation.createUser, createUser);

router.use(auth);
router.use('/cards', cardsRouter);
router.use('/users', userRouter);

router.use('*', require('./page404'));

module.exports = router;
