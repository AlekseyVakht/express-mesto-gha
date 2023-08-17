const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректно переданы данные' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным Id не существует' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный Id' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным Id не существует' });
      } else if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректно переданы данные' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным Id не существует' });
      } else if (err.name === 'ValidationError') {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректно переданы данные' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
      }
    });
};
