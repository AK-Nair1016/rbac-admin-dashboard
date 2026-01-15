import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// generate JWT
export const generateToken = (payload: {                // called by login controller
  userId: string;
  role: string;
}): string => {
    const token= jwt.sign(payload,JWT_SECRET, {
        expiresIn:"2h"
    });
    return token;
};

// verify JWT
export const verifyToken = (token: string): any => {    //called by auth middleware
  const decoded=jwt.verify(token,JWT_SECRET);
  return decoded;
};
