import express from 'express';
import controller from '../controllers/user';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/validate',extractJWT, controller.validateToken);
router.get('/signin', controller.signin);
router.get('/signup', controller.signup);


export = router; 
