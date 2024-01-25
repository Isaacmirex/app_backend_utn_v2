
import {getModulesByRolId} from "../controllers/permissions_modules.controller.js";
import {verifyToken} from "../middlewares/auth.jwt.js";
import {Router} from "express";

const getModulesRol_Router = Router();


/**
 * @openapi
 * /utnbackend/v2/getModulesByRol/{id}:
 *   get:
 *     tags:
 *       - Permissions Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the permission module to search
 *         schema:
 *           type: integer
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
getModulesRol_Router.get('/:id', verifyToken, getModulesByRolId);


export {getModulesRol_Router};
