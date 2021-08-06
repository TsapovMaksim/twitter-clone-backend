import express from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { mongoose } from '../core/db';

import { generateMD5 } from './../utils/generateHash';
import { UserModel, UserModelDocumentInterface } from './../models/UserModels';
import { sendEmail } from '../utils/sendEmail';

const isValidObjectId = mongoose.Types.ObjectId.isValid;

class UserController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();
      res.json({
        status: 'success',
        data: users,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
      });
    }
  }

  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;

      if (!isValidObjectId(userId)) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findById(userId).exec();

      if (!user) {
        res.status(404).send();
        return;
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() });
        return;
      }

      const data = {
        email: req.body.email,
        username: req.body.username,
        fullname: req.body.fullname,
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
        confirmHash: generateMD5(
          process.env.SECRET_KEY || Math.random().toString()
        ),
      };

      const user = await UserModel.create(data);

      sendEmail(
        {
          emailFrom: 'admin@twitter.com',
          emailTo: data.email,
          subject: 'Подтвержение почты Twitter Clone',
          html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${
            process.env.PORT || 8888
          }/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
        },
        err => {
          if (err) {
            res.status(500).json({
              status: 'error',
              message: JSON.stringify(err),
            });
          } else {
            res.status(201).json({
              status: 'success',
              data: user,
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash as string;

      if (!hash) {
        res.status(400).send();
        return;
      }

      const user = await UserModel.findOne({ confirmHash: hash }).exec();
      console.log(user);

      if (user) {
        user.confirmed = true;
        user.save();
        res.json({
          status: 'success',
        });
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Пользователь не найден' });
      }
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
      });
    }
  }

  async afterLogin(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user
        ? (req.user as UserModelDocumentInterface).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign({ data: user }, process.env.SECRET_KEY || '123', {
            expiresIn: '30 days',
          }),
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
      });
    }
  }

  async getUserInfo(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const user = req.user
        ? (req.user as UserModelDocumentInterface).toJSON()
        : undefined;
      res.json({
        status: 'success',
        data: user,
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(err),
      });
    }
  }
}

export const UserCtrl = new UserController();
