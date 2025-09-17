const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUser, deleteUser, googleAuth } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuth);

// Admin routes
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
