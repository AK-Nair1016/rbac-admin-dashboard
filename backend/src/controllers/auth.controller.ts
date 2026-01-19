import { Request, Response } from "express";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { getUserByEmail } from "../utils/userQueries";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.employee_id) {
      // Safety check during EID rollout
      return res.status(500).json({
        message: "User is not properly configured",
      });
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🔐 JWT payload (internal + human-facing identifiers)
    const token = generateToken({
      userId: user.id,              // UUID (internal)
      employeeId: user.employee_id, // EID (frontend-safe)
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,                  // optional for frontend
        employeeId: user.employee_id, // primary display/search ID
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
