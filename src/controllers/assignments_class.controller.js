import {client} from "../database/database.js";
import {postAuditing} from "./auditing.controller.js";

const getAssignmentsClass = async (req, res) => {
  try {
    const response = await client.query(
      "SELECT assignment_class_id, class_id, user_id, assignment_class_state FROM assignments_class"
    );
    res.json(response.rows);
  } catch (err) {
    console.error("Error getting assignments_class", err);
    res
      .status(500)
      .json({error: "An error occurred while getting assignments_class"});
  }
};

const getAssignmentsClassById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await client.query(
      "SELECT assignment_class_id, class_id, user_id, assignment_class_state FROM assignments_class WHERE assignment_class_id = $1",
      [id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error("Error getting assignments_class by id", err);
    res.status(500).json({
      error: "An error occurred while getting assignments_class by id",
    });
  }
};

const createAssignmentsClass = async (req, res) => {
  try {
    const {class_id, user_id, assignment_class_state} = req.body;
    const result = await client.query(
      "INSERT INTO public.assignments_class (class_id, user_id, assignment_class_state) VALUES ($1,$2,$3) RETURNING *",
      [class_id, user_id, assignment_class_state]
    );
    var audit_operation = result.command;
    var audit_affected_table = "assignments_class";
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
    const assignment_class_id = result.rows[0].assignment_class_id;
    res.json({
      message: "AssignmentsClass Added successfully",
      body: {
        assignments_class: {
          assignment_class_id,
          class_id,
          user_id,
          assignment_class_state,
        },
      },
    });
  } catch (err) {
    console.error("Error creating assignments_class", err);
    res
      .status(500)
      .json({error: "An error occurred while creating assignments_class"});
  }
};

const updateAssignmentsClass = async (req, res) => {
  try {
    const {assignment_class_id, class_id, user_id, assignment_class_state} =
      req.body;
    const ac_preview = await client.query(
      "select*from assignments_class where assignment_class_id = $1",
      [assignment_class_id]
    );
    const result = await client.query(
      "UPDATE public.assignments_class SET class_id = $1, user_id = $2, assignment_class_state = $3 WHERE assignment_class_id = $4 RETURNING *",
      [class_id, user_id, assignment_class_state, assignment_class_id]
    );
    var audit_operation = result.command;
    var audit_affected_table = "assignments_class";
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
    res.json({
      message: "AssignmentsClass Updated successfully",
      body: {
        assignments_class: {
          assignment_class_id,
          class_id,
          user_id,
          assignment_class_state,
        },
      },
    });
  } catch (err) {
    console.error("Error updating assignments_class", err);
    res
      .status(500)
      .json({error: "An error occurred while updating assignments_class"});
  }
};


const getAssignmentsClassByUser = async (req, res) => {

  const {id} = req.params;
  try {
    const user = await client.query(
      "SELECT * FROM users where user_id = " + id
    );
    if (user.rowCount > 0) {
      const roles = await client.query(
        "SELECT c.class_id, c.class_subject, c.class_date_start,c.class_date_finish, c.class_state from classroom c, assignments_class a where a.class_id = c.class_id and a.user_id = " +
        user.rows[0].user_id
      );

      res.status(200).json({
        user: user.rows[0],
        classroom: roles.rows || null
      });
    } else {
      res.status(200).json({
        user: null,
        classroom: null,
      });
    }
  } catch (error) {
    console.error("Error al obtener Classroom by user", error);
    res.status(400).json({error: "Error getting Classroom by user"});
  }
};


export {
  getAssignmentsClass,
  getAssignmentsClassById,
  createAssignmentsClass,
  updateAssignmentsClass,
  getAssignmentsClassByUser
};
