const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }, { new: true, runValidators: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Некорректно переданы данные карточки' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Карточка с указанным Id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Карточка с указанным Id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch(() => {
      if (res.status(404)) {
        res.send({ message: 'Карточка с указанным Id не найдена' });
      } else if (res.status(500)) {
        res.send({ message: 'Ошибка на сервере' });
      }
    });
};
