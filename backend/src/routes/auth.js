import express from "express";
import { pool } from "../services/db.js";
import jwt from "jsonwebtoken";
import web3 from "../utils/web3.js";
import config from "config";
import logger from "../utils/logger.js";
const router = express.Router();

router.get("/nonce", async (req, res) => {
  const publicKey = req.query.publicKey;
  if (!publicKey) {
    return res.status(400).send("No public key provided");
  }
  const nonce = generateNonce();

  const result = await pool.query("SELECT * FROM USERS WHERE public_key = $1", [
    publicKey,
  ]);
  if (result.rows.length === 0) {
    await pool.query("INSERT INTO USERS (public_key, nonce) VALUES ($1, $2)", [
      publicKey,
      nonce,
    ]);
  } else {
    await pool.query("UPDATE USERS SET nonce = $1 WHERE public_key = $2", [
      nonce,
      publicKey,
    ]);
  }
  res.status(200).send({ nonce });
});

router.post("/login", async (req, res) => {
  const body = req.body;
  // Move validation to swagger later on
  if (body.signature == null) {
    res.status(400).send("Missing signature");
    return;
  }

  if (body.publicKey == null) {
    res.status(400).send("Missing public key");
    return;
  }

  try {
    const userPayload = await verifySignature(body.publicKey, body.signature);

    const accessToken = jwt.sign(userPayload, config.get("jwt.secret"), {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      userPayload,
      config.get("jwt.refreshSecret"),
      {
        expiresIn: "7d",
      }
    );

    await pool.query(
      "UPDATE USERS SET refresh_token = $1 WHERE public_key = $2",
      [refreshToken, body.publicKey]
    );

    res.cookie("refreshToken", refreshToken, refreshTokenOpts);

    res.cookie("accessToken", accessToken, accessTokenOpts);

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    return res.status(error.status || 401).send(error.message);
  }
});

const refreshTokenOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  signed: true,
  path: "/auth",
  sameSite: "None",
};
const accessTokenOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 15 * 60 * 1000,
  path: "/",
  signed: true,
  sameSite: "None",
};
router.post("/token", async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  let users = await pool.query("SELECT * FROM USERS WHERE refresh_token = $1", [
    refreshToken,
  ]);
  if (users.rows.length === 0) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(refreshToken, config.get("jwt.refreshSecret"));
    const newAccessTokenBody = {
      publicKey: decoded.publicKey,
    };
    const accessToken = jwt.sign(newAccessTokenBody, config.get("jwt.secret"), {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      newAccessTokenBody,
      config.get("jwt.refreshSecret"),
      {
        expiresIn: "7d",
      }
    );
    await pool.query(
      "UPDATE USERS SET refresh_token = $1 WHERE public_key = $2",
      [newRefreshToken, decoded.publicKey]
    );

    res.cookie("refreshToken", newRefreshToken, refreshTokenOpts);

    res.cookie("accessToken", accessToken, accessTokenOpts);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    return res.sendStatus(401);
  }
});

async function verifySignature(publicKey, signature) {
  const query = await pool.query(
    "SELECT nonce FROM USERS WHERE public_key = $1",
    [publicKey]
  );
  if (query.rows.length === 0) {
    throw { status: 401, message: "Invalid public key" };
  }
  const nonce = query.rows[0].nonce;

  const message = `This is proof to Sesame that I own the wallet ${publicKey} with random nonce ${nonce}`;
  const messageAddress = web3.eth.accounts.recover(message, signature);
  if (messageAddress.toLowerCase() !== publicKey.toLowerCase()) {
    throw { status: 401, message: "Invalid signature" };
  }

  await updateUserNonce(publicKey);

  return {
    publicKey,
  };
}

function generateNonce() {
  return Math.floor(Math.random() * 1000000000000);
}

async function updateUserNonce(publicKey) {
  const nonce = generateNonce();
  await pool.query("UPDATE USERS SET nonce = $1 WHERE public_key = $2", [
    nonce,
    publicKey,
  ]);
}

export default router;
