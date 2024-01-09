// Importa el cliente de la base de datos
import { client } from "../database/database.js";
import axios from "axios";

async function getPublicIP() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error al obtener la IP pública:", error.message);
    return null;
  }
}

// Función para obtener todos los registros de la tabla auditing
const getAuditing = async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM public.auditing");
    res.json(response.rows);
  } catch (err) {
    console.error("Error getting auditing records", err);
    res
      .status(500)
      .json({ error: "An error occurred while getting auditing records" });
  }
};

// Función para obtener un registro de la tabla auditing por su ID
const getAuditingById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.query(
      "SELECT * FROM public.auditing WHERE audit_id = $1",
      [id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error("Error getting auditing record by id", err);
    res
      .status(500)
      .json({ error: "An error occurred while getting auditing record by id" });
  }
};

const postAuditing = async (
  audit_operation,
  audit_affected_table,
  user_id,
  audit_field_affect,
  changes
) => {
  try {
    const publicIP = await getPublicIP();
    var audit_date = new Date();
    const result = await client.query(
      "insert into auditing(audit_date, audit_operation, audit_affected_table, user_id, audit_field_affect, audit_ip_user, changes) values($1, $2, $3, $4, $5, $6, $7);",
      [
        audit_date,
        audit_operation,
        audit_affected_table,
        user_id,
        audit_field_affect,
        publicIP,
        changes,
      ]
    );
    if (result.rowCount == 0) {
      return "No se inserto la auditoria";
    } else {
      return result.rows;
    }
  } catch (error) {
    return error;
  }
};

// Exporta las funciones para su uso en otras partes de tu aplicación
export { getAuditing, getAuditingById, postAuditing };
