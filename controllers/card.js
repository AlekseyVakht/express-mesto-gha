const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректно переданы данные карточки' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным Id не существует' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным Id не существует' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный Id' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным Id не существует' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный Id' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};
