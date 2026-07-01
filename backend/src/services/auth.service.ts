import { findUserByEmail } from "../db/user.queries";
import { AppError } from "../errors/AppError";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { logger } from "../utils/logger";

type LoginInput = {
  email: string;
  password: string;
};

type LoginResult = {
  token: string;
  user: {
    id: string;
    employeeId: string;
    role: string;
    email: string;
  };
};

export const loginUser = async ({
  email,
  password,
}: LoginInput): Promise<LoginResult> => {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.warn(
      {
        event: "auth_login_failed",
        email,
        reason: "user_not_found",
      },
      "Authentication failed"
    );
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.employee_id) {
    logger.error(
      {
        event: "auth_login_failed",
        email,
        userId: user.id,
        reason: "missing_employee_id",
      },
      "User configuration error during login"
    );
    throw new AppError("User configuration error", 500);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    logger.warn(
      {
        event: "auth_login_failed",
        email,
        userId: user.id,
        reason: "invalid_password",
      },
      "Authentication failed"
    );
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    userId: user.id,
    employeeId: user.employee_id,
    role: user.role,
  });

  logger.info(
    {
      event: "auth_login_succeeded",
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id,
    },
    "User logged in"
  );

  return {
    token,
    user: {
      id: user.id,
      employeeId: user.employee_id,
      role: user.role,
      email: user.email,
    },
  };
};
