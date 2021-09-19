import { Router } from "express";
import {createTransaction, getAllUsersTransaction,getIndividualTransaction} from "../controllers/transactionController";
import {auth} from "../middleware/auth"
import { pagination } from '../middleware/pagination';
import Transaction from "../models/transactionModel";

const router = Router();

router.post("/transfer", auth, createTransaction);
router.get("/", auth, pagination(Transaction), getAllUsersTransaction);
router.get("/:_id", auth, getIndividualTransaction);

export default router;
