import jwt from "jsonwebtoken";

/* -----------------------------------------------------
   Environment Validation
----------------------------------------------------- */

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* -----------------------------------------------------
   JWT Payload Interface
----------------------------------------------------- */

export interface JwtPayload {
  userId: string;      // internal UUID
  employeeId: string;  // human-facing ID
  role: string;        // RBAC role
}

/* -----------------------------------------------------
   Generate JWT
----------------------------------------------------- */

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "2h",
  });
};

/* -----------------------------------------------------
   Verify JWT
----------------------------------------------------- */

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  return decoded;
};
