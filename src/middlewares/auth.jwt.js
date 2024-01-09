import jwt from "jsonwebtoken";
import { client } from "../database/database.js";

async function getUserById(id) {
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
      return res.status(403).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, "secret");
    const user = await getUserById(decoded.user_id);
    req.user = user;
    if (!user) {
      return res.status(500).json({ message: "Unauthorized, User not foud!" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Unauthorized" });
  }
};
export { verifyToken };
