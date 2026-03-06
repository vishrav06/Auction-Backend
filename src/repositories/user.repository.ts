import { pool } from "../db/pool";
import { User } from "../models/user.model";

const findByEmail = async(email: string): Promise<User | null> =>{
    const result = await pool.query<User>(
        `SELECT * FROM users WHERE email = $1  LIMIT 1`,
        [email]
    );

    return result.rows[0] ?? null;
};

const findByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT * FROM users WHERE username = $1 LIMIT 1`,
    [username]
  );
  return result.rows[0] ?? null;
};

const createUser = async (data: {
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
}): Promise<User> => {
  const result = await pool.query<User>(
    `INSERT INTO users (username, email, password_hash, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.username, data.email, data.password_hash, data.avatar_url]
  );
  return result.rows[0];
};


export const userRepository = {
  findByEmail,
  findByUsername,
  createUser,
};