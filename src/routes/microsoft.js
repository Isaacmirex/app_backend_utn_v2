import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { client } from "../database/database.js";

const loginRouter = Router();

loginRouter.use(cookieParser());
loginRouter.use(passport.initialize());

loginRouter.get("/microsoft", (req, res, next) => {
  const origin = req.get("Origin") || req.get("Referer");
  req.session.origin = origin;
  passport.authenticate(
    "auth-microsoft",
    { prompt: "select_account", session: false },
    (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      res.json({ token });
    }
  )(req, res, next);
});

loginRouter.get(
  "/microsoft/callback",
  passport.authenticate("auth-microsoft", {
    failureRedirect: "/auth/microsoft",
    session: false,
  }),
  async (req, res) => {
    var origin_domain = req.session.origin;
    try {
      const data = await client.query(
        "SELECT * FROM users where user_code = '" + req.user.profile.id + "'"
      );
      const user_token = jwt.sign(
        {
          iss: "https://app-backend-utn-2023.onrender.com",
          iat: Math.floor(Date.now() / 1000),
          nbf: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          app_displayname: "app-backend-utn-2023",
          appid: "app_9e7db781-2c01-40b8-8eef-54007e8db3aa",
          family_name: data.rows[0].user_last_name,
          given_name: data.rows[0].user_first_name,
          unique_name: data.rows[0].user_email,
          upn: data.rows[0].user_password,
          user_id: data.rows[0].user_id,
          user_code: data.rows[0].user_code,
          user_full_name:
            data.rows[0].user_first_name + " " + data.rows[0].user_last_name,
          user_first_name: data.rows[0].user_first_name,
          user_last_name: data.rows[0].user_last_name,
          user_email: data.rows[0].user_email,
          user_password: data.rows[0].user_password,
          user_phone_number: data.rows[0].user_phone_number,
          user_state: data.rows[0].user_state,
          user_date_register: data.rows[0].user_date_register,
        },
        "secret"
      );
      const token = req.user.refreshToken.access_token;
      const userString = JSON.stringify({
        token: token,
        user: user_token,
      });
      res.send(`
        <!DOCTYPE html>
    <html lang="en">
      <body>
      </body>
      <script>
        window.opener.postMessage(${userString}, '${origin_domain}')
      </script>
    </html>
        `);
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

export { loginRouter };
