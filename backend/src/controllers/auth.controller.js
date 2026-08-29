const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


async function registerUserController (req,res) {
    const {username, email, password} = req.body;

    try {

        if(!username || !email || !password) {
           return res.status(400).json({
                message: "enter all crenditional required of register"
            });
        }

        const userExists = await userModel.findOne({
            email
        });

        if(userExists) {
            return res.status(400).json({
                message: "user already exists with this email"
            });
        }

        const user = await userModel.create({
            username,
            email,
            password
        });

        const userResponse = user.toObject();
        delete userResponse.password;

       const token =  jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

         const cookieOptions = {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 24 * 60 * 60 * 1000 
        };

        res.cookie('token',token,cookieOptions);

        return res.status(201).json({
            message: "register successfull",
            user : userResponse
        });

    }
    catch(error) {

        console.log("Register user error : ", error);
        return res.status(500).json({
            message: "Internal Server error"
        });
         
    }
}

async function loginUserController(req, res) {
    const { email, password } = req.body;

    try {
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

       
        const user = await userModel.findOne({ email }).select('+password');

        
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

       
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        res.cookie('token', token, cookieOptions);

        
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login successful",
            user: userResponse
        });

    } catch (error) {
        console.error("Login user error: ", error);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
}

module.exports = {registerUserController,loginUserController};