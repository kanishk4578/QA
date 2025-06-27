const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; //splitting token with space ["Bearer","Token(that we want to verify"]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
