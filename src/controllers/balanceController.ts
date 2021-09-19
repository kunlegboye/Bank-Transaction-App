import Account from "../models/balanceModel";
import { Request, Response } from "express";
import joi from "joi";

export async function createAccount(
  req: Request,
  res: Response
): Promise<void> {
  const registerSchema = joi.object({
    accountNumber: joi.string().trim().min(10).max(10).required(),
    amount: joi.string().required(),
  });
  try {
    const validationResult = await registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (validationResult.error) {
      res.status(404).json({
        message: "Error validation",
      });
      return;
    }
    const newBalance = await Account.create({
      accountNumber: req.body.accountNumber,
      amount: req.body.amount,
    });

    //redirect
    res.status(201).json({
      status: "success",
      data: {
        newBalance,
        message:"Account created successfully"
      },
    });
    return;
  } catch (err:any) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }
}


export async function getAllUsersBalance(
  req: Request,
  res: any,
): Promise<void> {

  res.send(res.paginatedResult)
  
}


export async function getIndividualBalance(
  req: Request,
  res: Response
): Promise<void> {
  const balance = req.params.accountNumber;
  const data = await Account.find({ accountNumber: balance });
  if (data) {
    res.status(200).json({
      status: "success",
      requestedAt: new Date().toISOString(),
      data: {
        data,
      },
    });
  } else {
    res.status(404).json({
      status: "Error",
      data: {
        message: `Balance information unavailable!`,
      },
    });
  }
}