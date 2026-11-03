import { findAssignableUsers } from "../db/user.queries";

export const getAssignableUsers = async () => {
  return findAssignableUsers();
};
