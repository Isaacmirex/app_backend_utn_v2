import {Router} from 'express';
import {verifyToken} from '../middlewares/auth.jwt.js';
import multer from "multer";
import {setIconWeb} from '../controllers/modulesController.js';


const setModuleRouterWeb = Router();

/**
 * @openapi
 * /utnbackend/v2/setIconWeb/{id}:
 *   put:
 *     tags:
 *       - Get Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the modules to search
 *         schema:
 *           type: integer
 *     summary: Update an existing module
 *     description: Set Icon for FrontEnd Web.
 *     requestBody:
 *       description: Updated module data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_icon_web:
 *                 type: string
 *                 example: image
 *              
 *             required:
 *               - module_id
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
 *               module_icon_web:
 *                 type: string
 *                 example: image
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
 *                   example: Module not found
 */
setModuleRouterWeb.put('/:id', verifyToken, setIconWeb);

export {setModuleRouterWeb};