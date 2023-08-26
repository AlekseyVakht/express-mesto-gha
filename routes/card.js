const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }).unknown(true),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.objectId().keys({
    cardId: Joi.string().alphanum(),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.objectId().keys({
    cardId: Joi.string().alphanum(),
  }).unknown(true),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.objectId().keys({
    cardId: Joi.string().alphanum(),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
