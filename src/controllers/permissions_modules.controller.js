import {client} from "../database/database.js";
import {postAuditing} from "./auditing.controller.js";

const getPermissionsModules = async (req, res) => {
    try {
        const result = await client.query(`
            select p.permissions_id, p.rol_id, p.module_id 
from permissions_modules p inner join roles r on p.rol_id = r.rol_id 
inner join modules m on m.module_id = p.module_id;`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener permisos de modulos", error);
        res.status(400).json({error: "Error getting module permissions"});
    }
};

const getPermissionsModulesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await client.query(`
            select p.permissions_id, p.rol_id, p.module_id 
from permissions_modules p inner join roles r on p.rol_id = r.rol_id 
inner join modules m on m.module_id = p.module_id and p.permissions_id = '${id}'`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener una permiso de modulo", error);
        res.status(400).json({error: "Error getting module permissions"});
    }
};

const createPermissionsModules = async (req, res) => {
    const {rol_id, module_id} = req.body;

    try {
        const result = await client.query(
            `
            insert into permissions_modules(rol_id, module_id) values ($1, $2)
            returning permissions_id, rol_id, module_id;
        `,
            [rol_id, module_id]
        );
        var audit_operation = result.command;
        var audit_affected_table = "permissions_modules";
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
        console.error("Error al crear una permiso del modulo", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};
/*
const updateModule_Sate = async (req, res) => {
    const moduleId = req.params.id;
    const { module_name, module_state } = req.body;

    try {
        const result = await client.query(`
            UPDATE modules SET module_name = $1, module_state = $2 WHERE module_id = $3
            RETURNING *;
        `, [module_name, module_state, moduleId]);

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Estado del modulo actualizado' });
        } else {
            res.status(404).json({ error: 'Modulo no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar modulo', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/
const deletePermissionsModulesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const ac_preview = await client.query(
            "select*from permissions_modules where permissions_id = $1",
            [id]
        );
        const result = await client.query(`
            DELETE FROM permissions_modules WHERE permissions_id = '${id}'`);
        const deletedAssignment = result.rows[0];
        if (result.rowCount > 0) {
            var audit_operation = result.command;
            var audit_affected_table = "permissions_modules";
            var userid = req.user.user_id;
            var audit_field_affect = ac_preview.rows[0];
            var changes = {
                change_of: ac_preview.rows[0],
                change_to: null,
            };
            await postAuditing(
                audit_operation,
                audit_affected_table,
                userid,
                audit_field_affect,
                changes
            );
            res
                .status(200)
                .json({message: "Module permission removed successfully!"});
        } else {
            res.status(201).json({message: "Module permission not found!"});
        }
    } catch (error) {
        console.error("Error al obtener una permiso del modulo", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};


export {
    getPermissionsModules,
    getPermissionsModulesByID,
    createPermissionsModules,
    deletePermissionsModulesByID
};
