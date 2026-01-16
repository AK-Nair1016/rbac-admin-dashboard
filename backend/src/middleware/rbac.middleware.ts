//rbac.middleware.ts
import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
     const user=(req as any).user;

     if(!user || !user.role){
        return res.status(401).json({message:"Unauthorized"});
     }

     if(!allowedRoles){
        return res.status(403).json({ message: "Access Denied" });
     }
     next();
    } catch (error) {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};
