const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

const apiRouter = express.Router();
apiRouter.post('/register', registerUser);
apiRouter.post('/login', loginUser);

module.exports = apiRouter;
