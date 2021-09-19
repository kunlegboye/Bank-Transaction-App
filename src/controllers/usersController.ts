import User from "../models/usersModel"
import {Request,Response} from 'express';
import joi from 'joi';
import jwt from 'jsonwebtoken';
const secret: string = process.env.JWT_SECRET as string;
const days: string = process.env.JWT_EXPIRES_IN as string;
const signToken = (id: string) => {
  return jwt.sign({ id }, secret, {
    expiresIn: days,
  });
};

export async function getAllUsers(req:Request,res:Response):Promise<void>{
    const users = await User.find();
    try{
        res.status(200).json({
            status: 'success',
            data:{
                users
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err,
        })
    }
}

export async function register(req: Request, res: Response): Promise<void> {
    const registerSchema = joi
      .object({
        name: joi.string().trim().min(2).max(64).required(),
        password: joi.string().required(),
        repeat_password: joi.ref('password'),
        email: joi
          .string()
          .trim()
          .lowercase()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
      })
      .with('password', 'repeat_password');
    try {
      const validationResult = await registerSchema.validate(req.body, {
        abortEarly: false,
      });
      if (validationResult.error) {
        res.status(404).json({
          message: 'validation Error',
        });
        return;
      }

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      const token = signToken(newUser._id);
      res.cookie('jwt', token, { httpOnly: true });
      res.status(201).json({
        status: 'success',
        data: {

          token: newUser._id,
        },
      });
      return;
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
      return;
    }
  }

  export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const loginSchema = joi.object({
      password: joi.string().required(),
      email: joi
        .string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),
    });
    console.log("shina")
    try {
      const validationResult = await loginSchema.validate(req.body, {
        abortEarly: false,
      });
      if (validationResult.error) {
        res.status(404).json({
          message: "validation Error",
        });
      }
      console.log("login")
      const user = await User.findOne({ email }).select("+password");
      const token = signToken(user._id);
      console.log(token);
      user.tokens = user.tokens.concat({ token });
      await user.save();
      res.cookie("jwt", token, { httpOnly: true });
      res.status(201).json({
        token: user._id,
      });
      return;
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
      return;
    }
  }

  export async function logout(req: any, res: Response): Promise<void> {
    console.log(req.user)
    req.user.tokens = req.user.tokens.filter(
      (token: { [key: string]: string }) => { 
        return token.token !== req.token;
      }
    );
    await req.user.save();
    res.status(200).json({
      message: "You have successfully logged out",
    });
  }



