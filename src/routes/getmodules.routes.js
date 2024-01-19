import {Router} from 'express';
import {getAssignmentsModules} from '../controllers/getmodules.js';
import {verifyToken} from '../middlewares/auth.jwt.js';
import multer from "multer";
import {createModuleWeb} from '../controllers/modulesController.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});

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


/**
 * @openapi
 * /utnbackend/v2/getModules:
 *   post:
 *     tags:
 *       - Get Modules
 *     summary: Create a new module
 *     description: Create a new module for Front End Web.
 *     requestBody:
 *       description: Module data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_icon_web:
 *                 type: string
 *                 example: table
 *             required:
 *               - module_name
 *               - module_state
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
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                  type: boolean
 *                  example: true  
 */
getmRouter.post('/', verifyToken, createModuleWeb);

export {getmRouter};