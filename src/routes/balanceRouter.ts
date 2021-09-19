import { Router } from 'express';
import {createAccount, getAllUsersBalance, getIndividualBalance} from '../controllers/balanceController'
import {auth} from "../middleware/auth"
import { pagination } from '../middleware/pagination';

import Account from "../models/balanceModel";

const router = Router();

router.post('/create', auth, createAccount)
router.get('/balance',auth, pagination(Account), getAllUsersBalance)
router.get('/balance/:accountNumber', auth, getIndividualBalance)
export default router