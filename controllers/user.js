const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }, { runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Пользователь с указанным Id не найден' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Пользователь с указанным Id не найден' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Пользователь с указанным Id не найден' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};
