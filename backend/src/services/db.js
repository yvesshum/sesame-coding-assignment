import pg from "pg"
import config from "config"
const Pool = pg.Pool

export const pool = new Pool({
  user: config.get("db.user") ,
  host: config.get("db.host"),
  database: config.get("db.db"),
  password: config.get("db.password"),
  port: config.get("db.port"),
  max: config.get("db.max_conn") ?? 20, 
  connectionTimeoutMillis: config.get("db.conn_timeout") ?? 2000, 
});

export const getUserInfo = async (pubKey) => {
  const data = await pool.query(`
        SELECT public_key, owns_usdc, coupon 
        FROM USERS u
        WHERE u.public_key = $1
    `, [pubKey])
  return data
}