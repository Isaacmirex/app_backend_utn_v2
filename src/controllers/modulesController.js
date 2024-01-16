import {client} from "../database/database.js";
import {getComponentModuleName, getRoute} from "../utils/encrypt.js";
import {postAuditing} from "./auditing.controller.js";
import multer from "multer";
import path from "path"



const getModules = async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM modules ORDER BY module_id"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener modulos", error);
    res.status(400).json({error: "Error getting modules"});
  }
};

const getModulesByID = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await client.query(
      `SELECT * FROM modules WHERE module_id = '${id}'`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener un modulo", error);
    res.status(400).json({error: "Error getting a module"});
  }
};


const updateModule_Sate = async (req, res) => {
  const moduleId = req.params.id;
  const {module_name, module_state} = req.body;

  try {
    const ac_preview = await client.query(
      "select*from modules where module_id = $1",
      [moduleId]
    );
    const result = await client.query(
      `
            UPDATE modules SET module_name = $1, module_state = $2 WHERE module_id = $3
            RETURNING *;
        `,
      [module_name, module_state, moduleId]
    );

    if (result.rows.length > 0) {
      var audit_operation = result.command;
      var audit_affected_table = "modules";
      var userid = req.user.user_id;
      var audit_field_affect = req.body;
      var changes = {
        change_of: ac_preview.rows[0],
        change_to: result.rows[0],
      };
      await postAuditing(
        audit_operation,
        audit_affected_table,
        userid,
        audit_field_affect,
        changes
      );
      res.status(200).json({message: "Updated module status"});
    } else {
      res.status(404).json({error: "Module not found"});
    }
  } catch (error) {
    console.error("Error al actualizar modulo", error);
    res.status(500).json({error: "Error updating a module"});
  }
};

export {getModules, getModulesByID, updateModule_Sate};
