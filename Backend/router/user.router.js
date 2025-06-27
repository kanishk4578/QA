const express = require('express');
const router = express.Router();
const {registerUser,loginUser,logout,getUserProfile, profileSetup} = require('../controllers/authController')
const isLoggedIn = require('../middlewears/isLoggedIn')
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/userdata",isLoggedIn,getUserProfile);
router.get("/logout",isLoggedIn,logout);
router.post('/upload-profile', upload.single('profile'),isLoggedIn,profileSetup);

module.exports = router