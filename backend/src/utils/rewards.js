import { pool } from "../services/db.js";

/**
 * 
 * @param {string} publicKey address of the user
 * @returns coupon string
 */
export async function createCoupon(publicKey) {
    const coupon = Math.random().toString(36).substring(2, 12).toUpperCase();
    await pool.query("UPDATE USERS SET coupon=$1, owns_usdc=TRUE WHERE public_key = $2", [coupon, publicKey]);
    return coupon
}