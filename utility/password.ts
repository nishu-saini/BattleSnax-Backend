import bcrypt from "bcrypt";

export const genrateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const hashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
