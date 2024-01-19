import {Router} from 'express';
import {verifyToken} from '../middlewares/auth.jwt.js';
import multer from "multer";
import {setIconMovil, setIconWeb} from '../controllers/modulesController.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});

const setModuleRouter = Router();


/**
 * @openapi
 * /utnbackend/v2/setIconMovil/{id}:
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
 *     description: Set Icon for FrontEnd Movil.
 *     requestBody:
 *       description: Updated module data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_icon_image:
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
 *               module_icon_image:
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
setModuleRouter.put('/:id', verifyToken, upload.single("module_icon_image"), setIconMovil);

export {setModuleRouter};