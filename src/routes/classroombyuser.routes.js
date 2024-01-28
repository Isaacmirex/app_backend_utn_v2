import {Router} from 'express';
import {getAssignmentsClassByUser} from '../controllers/assignments_class.controller.js';
import {verifyToken} from '../middlewares/auth.jwt.js';

const get_assignments_classRouter = Router();

/**
 * @openapi
 * /utnbackend/v2/getClassRoomByUser/{id}:
 *   get:
 *     tags:
 *       - Assignments Class
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Assignments Class to search
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
 * 
 */
get_assignments_classRouter.get('/:id', verifyToken, getAssignmentsClassByUser);

export {get_assignments_classRouter};