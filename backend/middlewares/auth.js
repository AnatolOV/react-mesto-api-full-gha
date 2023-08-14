const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { ANAUTHORUZED_REQUEST_401 } = require('../utils/errors/errors');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ANAUTHORUZED_REQUEST_401('Пожалуйста, авторизируйтесь'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(
      new ANAUTHORUZED_REQUEST_401('Пользователь не зарегистрирован'),
    );
  }

  req.user = payload;
  return next();
};
