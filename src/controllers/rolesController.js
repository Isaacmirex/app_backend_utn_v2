import { client } from "../database/database.js";
import { postAuditing } from "./auditing.controller.js";

const getRoles = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM roles ORDER BY rol_id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener roles", error);
    res.status(400).json({ error: "Error getting roles" });
  }
};

const getRolesByID = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      `SELECT * FROM roles WHERE rol_id = '${id}'`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener un rol", error);
    res.status(400).json({ error: "Error getting a role" });
  }
};

const createRol = async (req, res) => {
  const { rol_name } = req.body;

  try {
    const rol_state = true;

    const result = await client.query(
      `
            INSERT INTO roles (rol_name, rol_state) VALUES ($1, $2)
            RETURNING rol_name, rol_state;
        `,
      [rol_name, rol_state]
    );
    var audit_operation = result.command;
    var audit_affected_table = "roles";
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
    console.error("Error al crear rol", error);
    res.status(500).json({ error: "Error creating a new role" });
  }
};

const updateRol_Sate = async (req, res) => {
  const rolId = req.params.id;
  const { rol_name, rol_state } = req.body;

  try {
    const ac_preview = await client.query(
      "select*from roles where rol_id = $1",
      [rolId]
    );
    const result = await client.query(
      `
            UPDATE roles SET rol_name = $1, rol_state = $2 WHERE rol_id = $3
            RETURNING *;
        `,
      [rol_name, rol_state, rolId]
    );

    if (result.rows.length > 0) {
      var audit_operation = result.command;
      var audit_affected_table = "roles";
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
      res.status(200).json({ message: "Updated role status" });
    } else {
      res.status(404).json({ error: "Role not found   " });
    }
  } catch (error) {
    console.error("Error al actualizar rol", error);
    res.status(500).json({ error: "Error updating a role" });
  }
};

export { getRoles, getRolesByID, createRol, updateRol_Sate };
