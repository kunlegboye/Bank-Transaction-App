import { Router } from 'express';


const router = Router();

/* GET home page. */
router.get('/', function (_req, res) {
  res.render('index', { title: 'SQ008' });
});



export default router;
