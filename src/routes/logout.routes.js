import {Router} from "express";
import {verifyToken} from "../middlewares/auth.jwt.js";
const router_logout = Router();

import {logout} from "../controllers/login.controllers.js";

/**
 * @openapi
 * /utnbackend/v2/logout:
 *   get:
 *     tags:
 *       - Login
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 *                   items: 
 *                     type: object
 */
router_logout.get("/", logout);

export {router_logout}