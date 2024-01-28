import jwt from "jsonwebtoken";
import {client} from "../database/database.js";
import {config} from 'dotenv';
import {isBlacklisted} from "../utils/encrypt.js";

config()

async function getUserById (id) {
  try {
    const response = await client.query(
      `SELECT * FROM users WHERE user_id = '${id}'`
    );
    return response.rows[0];
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    const token = authorizationHeader && authorizationHeader.split(" ")[1] || req.headers["token"];
    if (!token) {
      return res.status(403).json({message: "No token provided"});
    }
    if (isBlacklisted(token)) {
      return res.status(500).json({message: "Unauthorized, Token is not valid!!"});
    }
    const secretkey = process.env.SECRET_KEY
    const decoded = jwt.verify(token, secretkey);
    const user = await getUserById(decoded.user_id);
    req.user = user;
    if (!user) {
      return res.status(500).json({message: "Unauthorized, User not foud!"});
    }
    next();
  } catch (error) {
    return res.status(500).json({message: "Unauthorized"});
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.status(200).json({
        message: "Logout successfully!"
      }) // Redirigir a la página de inicio de sesión después de cerrar sesión
    });
  } catch (error) {

  }
}

export {verifyToken};
