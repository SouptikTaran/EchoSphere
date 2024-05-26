const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET

    module.exports.tokenValidity = (req , res , next)=>{
        console.log(req.cookies);
        const token = req.cookies.token     
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        try {
            // Verify the token
            const payload = jwt.verify(token, secretKey);
            req.user = payload; 
            next(); 
        } catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid or expired token'  });
        }
    }
