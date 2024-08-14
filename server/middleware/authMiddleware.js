import jwt from "jsonwebtoken";

const isLoggedIn = async (req,res,next)=>{

    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({
            success: false,
            message: "user not login (token not present in cookie)"
        });
    }
    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = userDetails;

    next();
}

export{ isLoggedIn };