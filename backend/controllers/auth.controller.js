import Users from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../lib/utils/generateToken.js'

export const signup = async (req, res) => {
    try {
        const { fullName, userName, email, passWord } = req.body;
        console.log(req.body);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid Email Format" });
        }
        const existingUser = await Users.findOne({ userName: userName })
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existinhEmail = await Users.findOne({ email: email })
        if (existinhEmail) {
            return res.status(400).json({ error: "EmailId already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassWord = await bcrypt.hash(passWord, salt);

        const newUser = new Users({
            userName: userName,
            fullName: fullName,
            email: email,
            passWord: hashedpassWord
        })
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        } else {
            res.status(400).json({ error: "Invalid User Data" });
        }

    }
    catch (err) {
        console.log(req.body);

        console.error("Error during signup:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });

    }
}

export const login = async (req, res) => {
    try {
        const { userName, passWord } = req.body;

        // Ensure 'await' is used to properly handle the asynchronous call
        const user = await Users.findOne({ userName: userName });
  
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Check if the passWord field exists
        if (!user.passWord) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        if (typeof user.passWord !== 'string') {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Log the password values
        console.log("Provided Password:", passWord);
        console.log("Stored Password:", user.passWord);

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(passWord, user.passWord);


        // Compare the provided passWord with the stored hashed passWord
        const ispassWordValid = await bcrypt.compare(passWord, user.passWord);
        if (!ispassWordValid) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Generate token and set cookie if passWord is valid
        generateTokenAndSetCookie(user._id, res);

        // Send the user data as a response
        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg
            }
        });

    } catch (err) {
        console.error("Error during login:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message: "You have logged out successfully",
        });
    } catch (error) {
        console.log(error.message);
    }
}

export const getMe=async(req,res)=>{
    try {
        const user= await Users.findById(req.user._id).select("-passWord")
    } catch (error) {
        
    }
}
