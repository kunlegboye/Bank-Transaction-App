import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
export interface AllUser {
  name: string;
  email: string;
  password: string;
  tokens: { [key: string]: string }[];
}
const userSchema = new mongoose.Schema<AllUser>({
  name: {
    type: String,
    required: [true, 'Please, your name'],
  },
  email: {
    type: String,
    required: [true, 'Enter your  email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter avalid email'],
  },
  password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: 8,
    select: false,
  },
  tokens: [
    {
      token: String,
    },
  ],
});
userSchema.pre('save', async function (next: () => void) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model('User', userSchema);
export default User;