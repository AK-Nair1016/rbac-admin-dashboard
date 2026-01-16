import { Request, Response } from "express";
import {comparePassword} from "../utils/hash";
import {generateToken} from "../utils/jwt";
import { getUserByEmail } from "../utils/userQueries";

export const login =async (req: Request, res: Response)=> {
    try {
        // fetch user from database (select*from users where email=? in pseudo code)
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and Password are Required"});

        }
        const user= await getUserByEmail(email);
        if(!user){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        //compare password
        const isPasswordValid= await comparePassword(
            password,
            user.password
        );
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Credentials"});
        }
        // generate token for login
        const token =generateToken({
            userId: user.id,
            role: user.role,
        });
        //send response
        return res.status(200).json({
            message:"Login Successful",
            token,
        });
    } catch(error) {
          console.error("LOGIN ERROR:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};
