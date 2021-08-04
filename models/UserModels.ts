import { Schema, model, Document } from 'mongoose';

interface UserModelInterface {
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmHash: string;
  confirmed: boolean;
  location?: string;
  about?: string;
  website?: string;
}

type UserModelDocumentInterface = UserModelInterface & Document;

const UserSchema = new Schema<UserModelInterface>({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  fullname: {
    required: true,
    type: String,
  },
  username: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
    // select: false,
  },
  confirmHash: {
    required: true,
    type: String,
    // select: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  location: String,
  about: String,
  website: String,
});

UserSchema.set('toJSON', {
  transform: function (_: any, obj: any) {
    delete obj.password;
    delete obj.confirmHash;
    return obj;
  },
});

export const UserModel = model<UserModelDocumentInterface>('User', UserSchema);
