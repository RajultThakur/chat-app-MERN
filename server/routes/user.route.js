const express = require('express');
const { signIn, signup, getUserByID, getUserByToken, getUsers } = require('../controllers/user.controller');
const Auth = require('../middleware/auth');

const router = express.Router();
router.post('/register', signup);
router.post('/login', signIn);
router.get('/find:userId', Auth, getUserByID);
router.get('/', getUsers);

module.exports = router;