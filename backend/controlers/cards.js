const mongoose = require('mongoose');
const Card = require('../models/card');

const INFO_200_SEC_SEND = 200;
const INFO_201_SEC_REC = 201;
const {
  ERROR_IN_REQUATION,
  ERROR_403_PERMISSION,
  ERROR_404_NOTFOUND,
} = require('../utils/errors/errors');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(INFO_201_SEC_REC).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new ERROR_IN_REQUATION('Отправлены некорректные данные'),
        );
      }
      return next(err);
    });
};

module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();
      const user = req.user._id.toString();
      if (owner === user) {
        return Card.deleteOne(card).then(() => res
          .status(INFO_200_SEC_SEND)
          .send({ message: 'Карточка удалена' }));
      }
      return next(new ERROR_403_PERMISSION('Недостаточно прав для операции'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new ERROR_IN_REQUATION('Отправлены некорректные данные'),
        );
      }
      if (err.name === 'DocumentNotFoundError') {
        return next(new ERROR_404_NOTFOUND('Карточка не найдена'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_404_NOTFOUND('Карточка не найдена'));
      }
      return res
        .status(INFO_200_SEC_SEND)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new ERROR_IN_REQUATION('Отправлены некорректные данные'),
        );
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new ERROR_404_NOTFOUND('Карточка не была найдена'));
      }
      return res
        .status(INFO_200_SEC_SEND)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new ERROR_IN_REQUATION('Отправлены некорректные данные'),
        );
      }
      return next(err);
    });
};
