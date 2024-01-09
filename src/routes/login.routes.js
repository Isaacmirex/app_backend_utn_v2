import { Router } from "express";
import { verifyToken } from "../middlewares/auth.jwt.js";
const router = Router();

import { Login, setPassword } from "../controllers/login.controllers.js";

// Routes Login
/**
 * @openapi
 * /utnbackend/v2/login:
 *   post:
 *     tags:
 *       - Login
 *     summary: Login Users
 *     description: Login user at the system.
 *     requestBody:
 *       description: User data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *                 example: example@utn.edu.ec
 *               password:
 *                 type: string
 *                 example: ........
 *             required:
 *               - user_email
 *               - password
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Login
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_email:
 *                       type: string
 *                       example: example@utn.edu.ec
 *                     password:
 *                       type: string
 *                       example: ..........
 */
router.post("/", Login);

/**
 * @openapi
 * /utnbackend/v2/login/{user_id}:
 *   put:
 *     tags:
 *       - Login
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the users to set password
 *         schema:
 *           type: integer
 *     summary: Set password an existing user
 *     description: Set password an existing user in the system.
 *     requestBody:
 *       description: Set password on user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: ooooooooooooooooooo
 *               repeat_password:
 *                 type: string
 *                 example: ooooooooooooooooooo
 *             required:
 *               - user_id
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
 *                   type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: ooooooooooooooooooo
 *               repeat_password:
 *                 type: string
 *                 example: ooooooooooooooooooo
 *
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 */
router.put("/:user_id", setPassword);

export { router };
