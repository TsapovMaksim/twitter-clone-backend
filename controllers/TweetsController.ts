import { UserModelInterface } from './../models/UserModels';
import express from 'express';
import { validationResult } from 'express-validator';
import { isValidObjectId } from '../utils/isValidObjectId';
import { TweetModel } from './../models/TweetModel';

class TweetsController {
  async index(_: any, res: express.Response) {
    try {
      const tweets = await TweetModel.find({})
        .populate('user')
        .sort({ createdAt: '-1' })
        .exec();

      res.json({
        status: 'success',
        data: tweets,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async show(req: express.Request, res: express.Response) {
    try {
      const tweetId = req.params.id;

      if (!isValidObjectId(tweetId)) {
        res.status(400).send();
        return;
      }

      const tweet = await TweetModel.findById(tweetId).populate('user').exec();

      if (!tweet) {
        res.status(404).send();
        return;
      }

      res.json({ status: 'success', data: tweet });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error });
    }
  }

  async create(req: express.Request, res: express.Response) {
    const user = req.user as UserModelInterface;
    try {
      if (user?._id) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
          return;
        }
        const data: any = {
          text: req.body.text,
          user: user,
        };

        const tweet = await TweetModel.create(data);

        res.json({ status: 'success', data: tweet });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error });
    }
  }

  async delete(req: express.Request, res: express.Response) {
    const user = req.user as UserModelInterface;

    try {
      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(user._id) === String(tweet.user._id)) {
            tweet.remove();
            res.send();
          } else {
            res.status(400).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error });
    }
  }

  async update(req: express.Request, res: express.Response) {
    const user = req.user as UserModelInterface;

    try {
      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          res.status(400).send();
          return;
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet) {
          if (String(tweet.user._id) === String(user._id)) {
            const text = req.body.text;
            tweet.text = text;
            await tweet.save();
            res.json({
              status: 'success',
              data: tweet,
            });
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export const TweetsCtrl = new TweetsController();
