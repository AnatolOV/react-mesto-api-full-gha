const router = require('express').Router();
const {
  ERROR_404_NOTFOUND,
} = require('../utils/errors/errors');

// router.all('*', (_req, res) => {
//   res.status(404).send({ message: 'Такой страницы не существует!' });
// });
router.all('*', (_req, res, next) => {
  next(new ERROR_404_NOTFOUND('Маршрут не найден'));
});

module.exports = router;
