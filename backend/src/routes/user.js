import express from "express";
import { getUserInfo } from "../services/db.js";
import { checkUSDCBalance } from "../utils/web3.js";
import { createCoupon } from "../utils/rewards.js";
const router = express.Router();

function validateUserPubKey(req, res, next) {
  const pubKey = req.params.pubKey;
  const user = req.user
  if (user.publicKey !== pubKey) {
    return res.sendStatus(401)
  }
  next();
}

router.get("/publicKey/:pubKey", validateUserPubKey, async (req, res) => {
  const pubKey = req.params.pubKey;
  const data = await getUserInfo(pubKey);
  if (data.rows.length === 0) {
    return res.status(404).send("User not found");
  }

  res.json({ user: data.rows[0] });
});

router.post("/publicKey/:pubKey/verify", validateUserPubKey, async (req, res) => {
  const pubKey = req.params.pubKey;

  const data = await getUserInfo(pubKey);
  if (data.rows.length === 0) {
    return res.status(404).send("User not found");
  }

  const { owns_usdc, coupon } = data.rows[0];
  if (owns_usdc) {
    return res.json({ owns_usdc, coupon });
  }

  const hasUSDC = await checkUSDCBalance(pubKey);
  if (hasUSDC) {
    const coupon = await createCoupon(pubKey);
    return res.json({ owns_usdc: true, coupon });
  } else {
    return res.json({ owns_usdc: false, coupon: null });
  }
});

export default router;
