import {Router} from "express";
const router_setpassword = Router();

import {setPasswordByEmail} from "../controllers/login.controllers.js";


/**
 * @openapi
 * /utnbackend/v2/setPasswordEmail/{user_id}:
 *   put:
 *     tags:
 *       - Login
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID of the users to set password
 *         schema:
 *           type: string
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
router_setpassword.put("/:user_id", setPasswordByEmail);


export {router_setpassword}