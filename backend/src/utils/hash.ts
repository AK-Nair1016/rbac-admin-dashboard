import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// hash a plain password
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword=await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword;
};

// compare plain password with hashed password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
    const passwordMatches=await bcrypt.compare(password,hashedPassword)
    return passwordMatches;
};
