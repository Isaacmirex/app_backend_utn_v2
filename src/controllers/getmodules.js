import {client} from "../database/database.js";
import {getTableName} from "../utils/encrypt.js";

const getConsultaModules = async (id) => {
  try {
    const result = await client.query("SELECT * FROM " + getTableName(id));
    return result.rows;
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    return null;
  }
};

const getAssignmentsModulesMovil = async (req, res) => {

  const {id} = req.params;
  try {
    const user = await client.query(
      "SELECT * FROM users where user_id = " + id
    );
    if (user.rowCount > 0) {
      const roles = await client.query(
        "SELECT r.rol_id, r.rol_name, r.rol_state FROM roles as r, assignments_modules as a, users as u, modules as m WHERE a.user_id = u.user_id and a.rol_id = r.rol_id and m.module_id = a.module_id and u.user_id = " +
        user.rows[0].user_id +
        "  GROUP BY r.rol_id, r.rol_name, r.rol_state;"
      );
      const modules = await client.query(
        "SELECT m.module_id, m.module_name, m.module_state, m.module_icon_web, m.module_icon_movil, m.module_icon_image, m.module_route, m.module_component FROM roles as r, assignments_modules as a, users as u, modules as m WHERE a.user_id = u.user_id and a.module_id = m.module_id and m.module_id = a.module_id and u.user_id = " +
        user.rows[0].user_id +
        " GROUP BY m.module_id, m.module_name, m.module_state;"
      );
      const updatedModules = await Promise.all(
        modules.rows.map(async module => {
          const values = await getConsultaModules(module.module_id);
          return {
            ...module,
            values
          };
        })
      );

      res.status(200).json({
        user: user.rows[0],
        roles: roles.rows || null,
        modules: updatedModules,
      });
    } else {
      res.status(200).json({
        user: null,
        roles: null,
        modules: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener asignaciones de modulos", error);
    res.status(400).json({error: "Error getting module assignments"});
  }
};

const getAssignmentsModules = async (req, res) => {
  console.log("Usuario: ", req.user)
  const {id} = req.params;
  try {
    const user = await client.query(
      "SELECT * FROM users where user_id = " + id
    );
    if (user.rowCount > 0) {
      const roles = await client.query(
        "SELECT r.rol_id, r.rol_name, r.rol_state FROM roles as r, assignments_modules as a, users as u, modules as m WHERE a.user_id = u.user_id and a.rol_id = r.rol_id and m.module_id = a.module_id and u.user_id = " +
        user.rows[0].user_id +
        "  GROUP BY r.rol_id, r.rol_name, r.rol_state;"
      );
      const modules = await client.query(
        "SELECT m.module_id, m.module_name, m.module_state, m.module_icon_web, m.module_icon_movil, m.module_icon_image, m.module_route, m.module_component FROM roles as r, assignments_modules as a, users as u, modules as m WHERE a.user_id = u.user_id and a.module_id = m.module_id and m.module_id = a.module_id and u.user_id = " +
        user.rows[0].user_id +
        " GROUP BY m.module_id, m.module_name, m.module_state;"
      );

      res.status(200).json({
        user: user.rows[0],
        roles: roles.rows || null,
        modules: modules.rows,
      });
    } else {
      res.status(200).json({
        user: null,
        roles: null,
        modules: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener asignaciones de modulos", error);
    res.status(400).json({error: "Error getting module assignments"});
  }
};

export {getAssignmentsModules, getAssignmentsModulesMovil};
