import { UserModelInterface } from './UserModels';
import { Document, Schema, model } from 'mongoose';

export interface TweetModelInterface {
  _id?: string;
  text: string;
  user: UserModelInterface;
}

export type TweetModelDocumentInterface = TweetModelInterface & Document;

const TweetSchema = new Schema<TweetModelInterface>(
  {
    text: {
      required: true,
      type: String,
      maxlength: 280,
    },
    user: {
      required: true,
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const TweetModel = model<TweetModelDocumentInterface>(
  'Tweet',
  TweetSchema
);
