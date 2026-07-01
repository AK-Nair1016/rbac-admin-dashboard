import { findUserByEmail } from "../db/user.queries";
import { AppError } from "../errors/AppError";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

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
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.employee_id) {
    throw new AppError("User configuration error", 500);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    userId: user.id,
    employeeId: user.employee_id,
    role: user.role,
  });

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
