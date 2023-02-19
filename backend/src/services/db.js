import pg from "pg"
const Pool = pg.Pool

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  max: process.env.POSTGRES_MAX_CONN ?? 20, 
  connectionTimeoutMillis: process.env.POSTGRES_CONN_TIMEOUT ?? 2000, 
});

export const getUserInfo = async (pubKey) => {
  const data = await pool.query(`
        SELECT public_key, owns_usdc, coupon 
        FROM USERS u
        WHERE u.public_key = $1
    `, [pubKey])
  return data
}