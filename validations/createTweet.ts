import { body } from 'express-validator';

export const createTweetValidations = [
  body('text', 'Введите текст твита')
    .isString()
    .isLength({ max: 280 })
    .withMessage('Максимальная длина твита 280 символов'),
];
