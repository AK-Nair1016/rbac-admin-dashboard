import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * JWT payload structure used across the app
 * - userId: internal UUID (never exposed for business logic)
 * - employeeId: human-facing ID (EID)
 * - role: RBAC role
 */
export interface JwtPayload {
  userId: string;
  employeeId: string;
  role: string;
}

// generate JWT (called by login controller)
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h",
  });
};

// verify JWT (called by auth middleware)
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  return decoded;
};
