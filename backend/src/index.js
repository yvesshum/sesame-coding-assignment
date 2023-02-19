import logger from "./utils/logger.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import passport from "passport";
import { Strategy } from "passport-jwt";
import cookieParser from "cookie-parser";
import { pool } from "./services/db.js";
import config from "config"
import fs from "fs"
import https from "https"
const app = express();

app.use(cors({origin: "https://yvesshum.github.io", credentials: true}));

app.use(express.json());
app.use(cookieParser(config.get("jwt.secret")));
passport.use(
  new Strategy(
    {
      jwtFromRequest: (req) => req.cookies.accessToken,
      secretOrKey: config.get("jwt.secret"),
    },
    (payload, done) => {
      console.log(payload)
      return done(null, payload);
    }
  )
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use("/auth", authRoutes);

app.use("/user", passport.authenticate("jwt", { session: false }), userRoutes);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong");
});

const PORT = config.get("server.port");
let server = null 
if (process.env.NODE_ENV === "development") {
  server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });
} else {
  const options = {
    key: fs.readFileSync("./certs/api.key"),
    cert: fs.readFileSync("./certs/api.crt")
  }
  server = https.createServer(options, app).listen(PORT, function(){
    logger.info(`Server started on port ${PORT}`)
  });
}


process.on('SIGTERM', async () => {
    logger.info("Gracefully shutting down")
    server.close()
    await pool.end()
    process.exit(1)
})

process.on("SIGINT", async () => {
    logger.info("Gracefully shutting down")
    server.close()
    await pool.end()
    process.exit(0)
})