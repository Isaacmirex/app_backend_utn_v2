import {Router} from 'express';
import {getPermissionsModules, getPermissionsModulesByID, createPermissionsModules, deletePermissionsModulesByID} from '../controllers/permissions_modules.controller.js';
import {verifyToken} from '../middlewares/auth.jwt.js';
const permisions_modulesRouter = Router();

// Ruta protegida que requiere el rol "Usuarios"
// Routes Permissions Modules:
/**
 * @openapi
 * /utnbackend/v2/permissions_modules:
 *   get:
 *     tags:
 *       - Permissions Modules
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
permisions_modulesRouter.get('/', verifyToken, getPermissionsModules);
/**
 * @openapi
 * /utnbackend/v2/permissions_modules/{id}:
 *   get:
 *     tags:
 *       - Permissions Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment module to search
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
permisions_modulesRouter.get('/:id', verifyToken, getPermissionsModulesByID);

/**
 * @openapi
 * /utnbackend/v2/permissions_modules:
 *   post:
 *     tags:
 *       - Permissions Modules
 *     summary: Create a new permission module
 *     description: Create a new permission module in the system.
 *     requestBody:
 *       description: Permission module data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol_id:
 *                 type: integer
 *                 example: 1
 *               module_id:
 *                 type: integer
 *                 example: 5
 *             required:
 *               - rol_id
 *               - module_id
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
 *                   example: Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     rol_id:
 *                       type: integer
 *                       example: 1
 *                     module_id:
 *                       type: integer
 *                       example: 5
 */
permisions_modulesRouter.post('/', verifyToken, createPermissionsModules);
/*assignments_modulesRouter.put('/:id', updateModule_Sate);*/
/**
 * @openapi
 * /utnbackend/v2/permissions_modules/{id}:
 *   delete:
 *     tags:
 *       - Permissions Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the permission module to delete
 *         schema:
 *           type: integer
 *     summary: Delete an permission module
 *     description: Delete an permission module in the system.
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
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Permission module deleted successfully
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Permission module not found
 */
permisions_modulesRouter.delete('/:id', verifyToken, deletePermissionsModulesByID);

export {permisions_modulesRouter};