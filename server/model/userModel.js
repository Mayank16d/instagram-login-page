import mongoose from "mongoose";
// import { Schema,model } from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        minLength: [5, "Name must be at least 5 characters"],
        maxLength: [50, "Name must not be more than 50 characters"],
    },
    userName:{
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        minLength: [5, "Username must be at least 5 characters"],
        maxLength: [50, "Username must not be more than 50 characters"],
        unique: [true, "Username already exists"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [160, "Bio must not be more than 160 characters"],
    },

});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods ={
    generateJWTToken: async function(){
        return await jwt.sign(
            { id: this._id, email: this.email, name: this.name, userName: this.userName, bio:this.bio},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    }
}

const User = mongoose.model("User", userSchema);

export default User;