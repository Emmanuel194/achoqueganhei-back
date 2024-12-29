import pool from "../config/database";

interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length ? (rows[0] as User) : null;
};

export const createUser = async (user: User): Promise<void> => {
  await pool.query(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
    [user.email, user.password, user.name]
  );
};

export const updateUserPassword = async (
  email: string,
  password: string
): Promise<void> => {
  await pool.query("UPDATE users SET password = ? WHERE email = ?", [
    password,
    email,
  ]);
};
