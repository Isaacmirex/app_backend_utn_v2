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


const createModuleWeb = async (req, res) => {
  const {module_name, module_icon_web} = req.body;
  //const module_icon_image = req.file.originalname;
  const module_component = getComponentModuleName(module_name);
  const module_route = getRoute(module_name)
  try {
    const module_state = true;
    //const imagenBuffer = "/src/images/" + module_icon_image;
    //console.log(imagenBuffer)
    const result = await client.query(
      `
            INSERT INTO modules (module_name, module_state, module_icon_web, module_icon_movil, module_icon_image, module_route, module_component) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING module_id,  module_name, module_state,  module_icon_web, module_icon_movil, module_icon_image, module_route, module_component;
        `,
      [module_name, module_state, module_icon_web, null, null, module_route, module_component]
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


const setIconWeb = async (req, res) => {
  const moduleId = req.params.id;
  const {module_icon_web} = req.body;

  try {
    const ac_preview = await client.query(
      "select*from modules where module_id = $1",
      [moduleId]
    );
    const result = await client.query(
      `
            UPDATE modules SET module_icon_web = $1 WHERE module_id = $2
            RETURNING *;
        `,
      [module_icon_web, moduleId]
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
      res.status(200).json({message: "Updated module icon web"});
    } else {
      res.status(404).json({error: "Module not found"});
    }
  } catch (error) {
    console.error("Error al actualizar modulo", error);
    res.status(500).json({error: "Error updating a module"});
  }
};


const setIconMovil = async (req, res) => {
  const moduleId = req.params.id;
  const module_icon_image = req.file.originalname;
  console.log(module_icon_image)

  try {
    const imagenBuffer = "/src/images/" + module_icon_image;
    const ac_preview = await client.query(
      "select*from modules where module_id = $1",
      [moduleId]
    );
    const result = await client.query(
      `
            UPDATE modules SET module_icon_image = $1 WHERE module_id = $2
            RETURNING *;
        `,
      [imagenBuffer, moduleId]
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
      res.status(200).json({message: "Updated module icon Movil"});
    } else {
      res.status(404).json({error: "Module not found"});
    }
  } catch (error) {
    console.error("Error al actualizar modulo", error);
    res.status(500).json({error: "Error updating a module"});
  }
};


export {getModules, getModulesByID, updateModule_Sate, createModuleWeb, setIconMovil, setIconWeb};
