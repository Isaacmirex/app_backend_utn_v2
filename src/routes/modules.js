import {Router} from 'express';
import {getModules, getModulesByID, updateModule_Sate} from '../controllers/modulesController.js';
import {verifyToken} from '../middlewares/auth.jwt.js';
import {client} from "../database/database.js";
import {getComponentModuleName, getRoute} from "../utils/encrypt.js";
import {postAuditing} from '../controllers/auditing.controller.js';
import multer from "multer";
import path from "path"




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});


const createModule = async (req, res) => {
    const {module_name, module_icon_web, module_icon_movil} = req.body;
    const module_icon_image = req.file.originalname;
    const module_component = getComponentModuleName(module_name);
    const module_route = getRoute(module_name)
    try {
        const module_state = true;
        const imagenBuffer = "/src/images/" + module_icon_image;
        console.log(imagenBuffer)
        const result = await client.query(
            `
            INSERT INTO modules (module_name, module_state, module_icon_web, module_icon_movil, module_icon_imge, module_route, module_component) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING module_id,  module_name, module_state,  module_icon_web, module_icon_movil, module_icon_imge, module_route, module_component;
        `,
            [module_name, module_state, module_icon_web, module_icon_movil, imagenBuffer, module_route, module_component]
        );
        var audit_operation = result.command;
        var audit_affected_table = "modules";
        var userid = req.user.user_id;
        var audit_field_affect = req.body;
        var changes = {
            change_of: null,
            change_to: result.rows[0],
        };
        await postAuditing(
            audit_operation,
            audit_affected_table,
            userid,
            audit_field_affect,
            changes
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear modulo", error);
        res.status(500).json({error: "Error creating a new module"});
    }

};


const modulesRouter = Router();

// Ruta protegida que requiere el rol "Usuarios"
//Routes Modules:
/**
 * @openapi
 * /utnbackend/v2/modules:
 *   get:
 *     tags:
 *       - Modules
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
modulesRouter.get('/', verifyToken, getModules);
/**
 * @openapi
 * /utnbackend/v2/modules/{id}:
 *   get:
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the users to search
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
modulesRouter.get('/:id', verifyToken, getModulesByID);
/**
 * @openapi
 * /utnbackend/v2/modules:
 *   post:
 *     tags:
 *       - Modules
 *     summary: Create a new module
 *     description: Create a new module in the system.
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
 *               module_state:
 *                  type: boolean
 *                  example: true  
 *               module_icon_web:
 *                 type: string
 *                 example: table
 *               module_icon_movil:
 *                 type: string
 *                 example: https//img./adqw.jpg
 *               module_icon_image:
 *                 type: bytea
 *                 example: Example
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
modulesRouter.post('/', verifyToken, upload.single('module_icon_image'), createModule);
/**
 * @openapi
 * /utnbackend/v2/modules/{id}:
 *   put:
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the modules to search
 *         schema:
 *           type: integer
 *     summary: Update an existing module
 *     description: Update an existing module in the system.
 *     requestBody:
 *       description: Updated module data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                 type: boolean
 *                 example: false
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
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                 type: boolean
 *                 example: false
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
modulesRouter.put('/:id', verifyToken, updateModule_Sate);





export {modulesRouter};