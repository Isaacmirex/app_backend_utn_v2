import {client} from "../database/database.js";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import {postAuditing} from "./auditing.controller.js";
import validator from 'validator';

const getUsers = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users ORDER BY user_id");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(400).json({error: "Error getting users"});
  }
};

const getUsersByID = async (req, res) => {
  try {
    const {id} = req.params;
    const result = await client.query(
      `SELECT * FROM users WHERE user_id = '${id}'`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({error: "Error getting a user"});
  }
};

const getUserDesByID = async (id) => {
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE user_code = '${id}'`
    );
    return result.rows[0]; // Devuelve el primer usuario encontrado o undefined si no hay resultados
  } catch (error) {
    console.error("Error getting a user", error);
    return null; // Devuelve null en caso de error
  }
};

const getUserDesByIDorEmail = async (id_email) => {
  try {
    const result = await client.query(
      "select*from users where user_email = " +
      id_email +
      ";"
    );
    console.log("************", result.rows[0])
    if (!result.rows[0]) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    return null;
  }
};

const createUser = async (req, res) => {
  const {user_first_name, user_last_name, user_email, user_phone_number} =
    req.body;

  try {
    const search_user = await client.query(
      "SELECT * FROM users WHERE user_email = $1",
      [user_email]
    );
    if (!search_user.rows[0]) {
      if (validator.isEmail(user_email)) {

        // Autogenerar user_code como UUID
        const user_code = uuidv4();
        // Combinar user_first_name y user_last_name para obtener user_full_name
        const user_full_name = `${user_first_name} ${user_last_name}`;
        // Encriptar user_password (debes recibir user_password en req.body)
        const user_password = await bcrypt.hash(req.body.user_password, 10);
        // Configurar valores predeterminados
        const user_state = true;
        const user_date_register = new Date();
        const result = await client.query(
          `
            INSERT INTO users (user_code, user_full_name, user_first_name, user_last_name, user_email, 
                                user_password, user_phone_number, user_state, user_date_register) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_code, user_full_name, user_first_name, user_last_name, user_email, user_password, 
                user_phone_number, user_state, user_date_register;
        `,
          [
            user_code,
            user_full_name,
            user_first_name,
            user_last_name,
            user_email,
            user_password,
            user_phone_number,
            user_state,
            user_date_register,
          ]
        );
        if (result.rowCount > 0) {
          var audit_operation = result.command;
          var audit_affected_table = "users";
          var user_id = req.user.user_id;
          var audit_field_affect = req.body;
          var changes = {
            change_of: null,
            change_to: result.rows[0],
          };
          await postAuditing(
            audit_operation,
            audit_affected_table,
            user_id,
            audit_field_affect,
            changes
          );
          res.status(201).json(result.rows[0]);
        }
      } else {
        res.status(201).json({
          error: null,
          message: "User email is invalid!",
        });
      }
    } else {
      res.status(201).json({
        error: null,
        message: "User with " + user_email + " is already registered!",
      });
    }
  } catch (error) {
    console.error("Error al crear usuario", error);
    res.status(500).json({error: "Error creating user"});
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {user_first_name, user_last_name, user_email, user_phone_number} =
    req.body;

  try {
    const user_preview = await client.query(
      "select*from users where user_id = $1",
      [userId]
    );
    const user_full_name = `${user_first_name} ${user_last_name}`;
    const result = await client.query(
      `
            UPDATE users SET user_full_name = $1, user_first_name = $2, user_last_name = $3, user_email = $4, 
                            user_phone_number = $5 WHERE user_id = $6
            RETURNING *;
        `,
      [
        user_full_name,
        user_first_name,
        user_last_name,
        user_email,
        user_phone_number,
        userId,
      ]
    );
    if (result.rows.length > 0) {
      var audit_operation = result.command;
      var audit_affected_table = "users";
      var user_id = req.user.user_id;
      var audit_field_affect = req.body;
      var changes = {
        change_of: user_preview.rows[0],
        change_to: result.rows[0],
      };
      await postAuditing(
        audit_operation,
        audit_affected_table,
        user_id,
        audit_field_affect,
        changes
      );
      res.status(200).json({message: "Updated user status"});
    } else {
      res.status(404).json({error: "User not found"});
    }
  } catch (error) {
    console.error("Error al actualizar usuario", error);
    res.status(500).json({error: "Error updating user"});
  }
};

const updateUser_State = async (req, res) => {
  const userId = req.params.id;
  const {user_state} = req.body;
  const user_preview = await client.query(
    "select*from users where user_id = $1",
    [userId]
  );
  try {
    const result = await client.query(
      `
            UPDATE users SET user_state = $1 WHERE user_id = $2
            RETURNING *;
        `,
      [user_state, userId]
    );

    if (result.rows.length > 0) {
      var audit_operation = result.command;
      var audit_affected_table = "users";
      var user_id = req.user.user_id;
      var audit_field_affect = req.body;
      var changes = {
        change_of: user_preview.rows[0],
        change_to: result.rows[0],
      };
      await postAuditing(
        audit_operation,
        audit_affected_table,
        user_id,
        audit_field_affect,
        changes
      );
      res.status(200).json({message: "Estado del usuario actualizado"});
    } else {
      res.status(404).json({error: "Usuario no encontrado"});
    }
  } catch (error) {
    console.error("Error al actualizar usuario", error);
    res.status(500).json({error: "Error interno del servidor"});
  }
};

export {
  getUsers,
  getUsersByID,
  createUser,
  updateUser,
  updateUser_State,
  getUserDesByID,
};
