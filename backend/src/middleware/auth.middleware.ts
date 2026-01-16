import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticateJWT=(
    req: Request,
    res: Response,
    next:NextFunction
)=>{
    try{
        const authHeader= req.headers.authorization;
        
        if(!authHeader){
            return res.status(401).json({message:"Authorization header missing"});
        }

        const token=authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Token missing"});
        }
        const decoded=verifyToken(token);
        // attach user info to request
        (req as any).user=decoded;
        // allow request to continue
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid or expired token"})
    }
}