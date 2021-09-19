import { Router } from "express";
import { register, getAllUsers,login, logout} from "../controllers/usersController";
import {auth} from "../middleware/auth"
import { pagination } from '../middleware/pagination';
import User from "../models/usersModel";

const router = Router();

/* GET users listing. */
router.post("/signup", register);
router.get("/", auth,pagination(User), getAllUsers);
router.post("/login", login);
router.get("/logout", auth, logout);



export default router;















// import { signup,getAllUsers,login,logout} from "../controllers/usersController";
// import {auth} from "../middleware/auth"
// import { pagination } from '../middleware/pagination';
// import User from "../models/usersModel";

// const router = Router();

// /* GET users listing. */
// router.post("/signup", signup);
// router.get("/", auth,pagination(User), getAllUsers);
// router.post("/login", login);
// router.get("/logout", auth, logout);



// export default router;

















// import { Router,Request,Response } from 'express';
// import{getAllUsers,register,login} from "../controllers/usersController"

// const router = Router();

// /* GET users listing. */
// router.get('/',getAllUsers);
// router.post('/signup',register)
// router.post('/signin',login)


// export default router;
