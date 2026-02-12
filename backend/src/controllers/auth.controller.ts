import { Request, Response } from "express";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { getUserByEmail } from "../utils/userQueries";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.employee_id) {
      return res.status(500).json({
        success: false,
        message: "User configuration error",
      });
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      userId: user.id,
      employeeId: user.employee_id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        role: user.role,
        email: user.email,
      },
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
