import express from 'express';
import { registerUser, loginUser, logoutUser, Middleware, updateUserProfile, verifyUser, validateCasTicket, cas_login, casCallback } from '../controllers/User/Authentiction.js';
import { authUserByEmail } from '../controllers/User/Authentiction.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify-recaptcha', verifyUser);
router.get('/cas/callback', casCallback);
router.get('/cas/login', cas_login);
router.get('/auth-user-email/:email', authUserByEmail);
router.get('/auth-user', Middleware, (req, res) => {
    const user = req.user;
    res.status(200).json(
        {
            success: true,
            message: "User authenticated successfully",
            user,
        }
    )
});
router.put('/profile-update',Middleware, updateUserProfile);

export default router;
