import User from "../model/userModel.js";
import bcrypt from "bcrypt";


const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true
}

const createUser = async (req, res) => {
    const { name, email, password, userName, bio } = req.body;

    try {
        if (!name || !email || !password || !userName) {
            console.log(name,email,password,userName);
            return res.status(400).json({
                status: "fail",
                message: "Please provide name, email, password and username",
                name: name,email,password,userName
            });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "fail",
                message: "email already exists",
            });
        }
        const userNameExists = await User.findOne({ userName});
        if (userNameExists) {
            return res.status(400).json({
                status: "fail",
                message: "Username already exists",
            });
        }

        const user = await User.create({ name, email,password, userName, bio });
        return res.status(201).json({
            status: "success",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password",
            });
        }
        const user = await User.findOne({ email }).select('+password');;
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }
        const token = await user.generateJWTToken();

        res.cookie('token',token,cookieOptions);
        
        return res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
}

const user = async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
        return res.status(200).json({
            success: true,
            message:"User Data",
            user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:error.message
        });
    }
}


export { createUser, login, user };