import { pool } from "../db/pool";

const createRefreshToken = async (data: {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}): Promise<void> => {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [data.user_id, data.token_hash, data.expires_at]
  );
};

const findRefreshTokenByHash = async (tokenHash: string) => {
    const result = await pool.query(
        `SELECT * FROM refresh_tokens WHERE token_hash = $1 LIMIT 1`,
        [tokenHash]
    );
    return result.rows[0] ?? null;
};

const deleteRefreshTokenByHash = async (tokenHash: string): Promise<void> => {
    await pool.query(
        `DELETE FROM refresh_tokens WHERE token_hash = $1`,
        [tokenHash]
    );
};

export const authRepository = { 
    createRefreshToken,
    findRefreshTokenByHash,
    deleteRefreshTokenByHash
};