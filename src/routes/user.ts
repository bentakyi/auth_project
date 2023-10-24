import express from 'express';
import controller from '../controllers/user';

const router = express.Router();

router.get('./validate', controller.validateToken);
router.get('./signin', controller.signin);
router.get('./signup', controller.signup);

export = router; 
