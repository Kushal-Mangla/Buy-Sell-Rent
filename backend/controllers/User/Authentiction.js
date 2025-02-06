import bcrypt from 'bcryptjs';
import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import axios from 'axios';
import xml2js from 'xml2js';
import { casConfig } from '../../config/cas_login.js'; // Correct the import path

env.config();

const SECRET_KEY = process.env.RECAPTHA_SECRET_KEY; // Replace with actual secret key

const verifyUser =  async (req, res) => {
    const { token } = req.body;
    // console.log("Token",token);
    console.log("SECRET_KEY" , SECRET_KEY);
    if (!token) return res.status(400).json({ error: "reCAPTCHA token missing" });

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: SECRET_KEY,
                response: token,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            res.json({ success: true, message: "reCAPTCHA verified" });
        } else {
            res.status(400).json({ success: false, error: "reCAPTCHA verification failed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error verifying reCAPTCHA" });
    }
};

// Register
const registerUser = async (req, res) => {
    try {
        console.log("request Data", req.body);
        const { fname, lname, email, password, confirmPassword, phone, age } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success:false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        // create a new user
        const user = new User({
            fname,
            lname,
            email,
            password: hashedPassword,
            phone,
            age,
        });

        await user.save();

        res.status(201).json({ 
            success: true,
            message: "User registered successfully" 
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({ 
            success: false,
            message: "Something went wrong" 
        });
    }
}


// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({
            email,
        });
        console.log("Existing User", existingUser);
        if(!existingUser) {
            return res.status(404).json({ success:"false", message: "User does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({success:"false", message: "Invalid credentials" });
        }
        const token = jwt.sign({ 
            email: existingUser.email, id: existingUser._id, role: existingUser.role, fname: existingUser.fname, lname: existingUser.lname, phone: existingUser.phone, age: existingUser.age}, 
            'kushal', { expiresIn: "1h" }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        }).json({
            success: true,
            message: "User logged in successfully",
            user: {
                email: existingUser.email,
                role: existingUser.role,
                id: existingUser._id,
                age: existingUser.age,
                fname: existingUser.fname,
                lname: existingUser.lname,
                phone : existingUser.phone,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};        

// Logout

const logoutUser = async (req, res) => {
    res.clearCookie('token').json({ 
        success: true,
        message: "User logged out successfully" });
}


// Middleware
const Middleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({success:false, message: "Unauthorized" });
        }

        const isCustomAuth = token.length < 500;
        let decodedData;
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'kushal');
            req.user = decodedData;
            req.userId = decodedData?.id;
            req.role = decodedData?.role;
        }
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false, message: "Unauthorized" });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { phone, age, fname, lname } = req.body;
        console.log("Request Data", req.body);
        const userId = req.user.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { phone, age, fname, lname },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // update the states of the user 
        // redux states

        res.json({ success: true, user: updatedUser, 
            message: "User profile updated successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const createAuthCookie = (res, userData) => {
    // Create token
    const token = jwt.sign(
        { 
            id: userData.id,
            email: userData.email,
            role: userData.role
        },
        'kushal', // your secret key
        { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return token;
};

export const authUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create and set the cookie
        const token = createAuthCookie(res, {
            id: user._id,
            email: user.email,
            role: user.role // make sure your user model has this field
        });

        return res.status(200).json({
            success: true,
            user: {
                email: user.email,
                fname: user.fname,
                lname: user.lname,
                role: user.role,
                id: user._id
            },
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
const validateCasTicket = async (ticket) => {
  try {
    const validateUrl = `${casConfig.cas_url}/p3/serviceValidate?service=${encodeURIComponent(casConfig.service_url + '/api/user/cas/callback')}&ticket=${ticket}`;
    console.log("Validate URL:", validateUrl);
    const response = await axios.get(validateUrl);
    
    return new Promise((resolve, reject) => {
      xml2js.parseString(response.data, (err, result) => {
        if (err) reject(err);
        
        const serviceResponse = result['cas:serviceResponse'];
        if (serviceResponse['cas:authenticationSuccess']) {
          const success = serviceResponse['cas:authenticationSuccess'][0];
          const user = {
            email: success['cas:user'][0], // CAS returns email as user
            attributes: success['cas:attributes'] ? success['cas:attributes'][0] : {}
          };
          resolve(user);
        } else {
          reject(new Error('CAS Authentication failed'));
        }
      });
    });
  } catch (error) {
    throw new Error(`CAS Validation failed: ${error.message}`);
  }
};

const cas_login =  async (req, res) => {
    console.log("Redirecting to CAS login reached in backend");
    const loginUrl = `${casConfig.cas_url}/login?service=${encodeURIComponent(
      casConfig.service_url + "/api/user/cas/callback"
    )}`;
    // loginUrl = "${casConfig.cas_url}/login";
    console.log("Login URL:", loginUrl);
    // res.json({})
    res.redirect(loginUrl);
  };

const casCallback = async (req, res) => {
    console.log("CAS callback reached in backend");
        try {
          const { ticket } = req.query;
          if (!ticket) {
            return res.redirect("/login?error=no_ticket");
          }
          console.log("Ticket:", ticket);
          // Validate the CAS ticket    
          const userData = await validateCasTicket(ticket);
      
          if (userData) {
            console.log("user is validated");
      
            console.log("User email:", userData.email);
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
              console.log("User already exists");
              const token = jwt.sign(
                { id: existing._id, email: existing.email },
                "Thereisnosecretkey", 
                { expiresIn: "7d" } 
              );
              res.redirect(`http://localhost:5173/set-token?token=${token}`);  
            } else {
              console.log("User does not exist");
              res.redirect("http://localhost:5173/api/user/login");
            }
          } else {
            console.log("user is not validated");
            res.redirect(" http://localhost:5173/api/user/login");
          }
        } catch (error) {
          console.error("CAS authentication error:", error);
          res.redirect("/login?error=cas_auth_failed");
        }
};
export { registerUser, loginUser, logoutUser, Middleware, updateUserProfile, verifyUser, validateCasTicket, cas_login, casCallback };