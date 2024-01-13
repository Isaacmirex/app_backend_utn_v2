import {Router} from 'express';
import {getAssignmentsModules} from '../controllers/getmodules.js';
import {verifyToken} from '../middlewares/auth.jwt.js';

const getmRouter = Router();

/**
 * @openapi
 * /utnbackend/v2/getModules/{id}:
 *   get:
 *     tags:
 *       - Get Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID of the assignment module to search
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
getmRouter.get('/:id', verifyToken, getAssignmentsModules);

export {getmRouter};