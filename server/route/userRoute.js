import express from 'express';
import {createUser,login,user} from '../controller/userController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/register', createUser);
router.get('/login', login);
router.get('/user',isLoggedIn, user);

export default router;
