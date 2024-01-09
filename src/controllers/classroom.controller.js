import { client } from "../database/database.js";
import { postAuditing } from "./auditing.controller.js";
// Isaac
const getClassroom = async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM classroom ");
    res.json(response.rows);
  } catch (err) {
    console.error("Error getting classrooms", err);
    res
      .status(500)
      .json({ error: "An error occurred while getting classrooms" });
  }
};

const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.query(
      "SELECT * FROM classroom WHERE class_id = $1",
      [id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error("Error getting classroom by id", err);
    res
      .status(500)
      .json({ error: "An error occurred while getting classroom by id" });
  }
};

const creatClassroom = async (req, res) => {
  try {
    const { class_subject, class_date_start, class_date_finish, class_state } =
      req.body;
    const result = await client.query(
      "INSERT INTO public.classroom (class_subject, class_date_start, class_date_finish, class_state) VALUES ($1,$2,$3,$4) RETURNING *",
      [class_subject, class_date_start, class_date_finish, class_state]
    );
    const class_id = result.rows[0].class_id; // Get the automatically generated class_id
    var audit_operation = result.command;
    var audit_affected_table = "classroom";
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

    res.json({
      message: "Classroom Added successfully",
      body: {
        classroom: {
          class_id,
          class_subject,
          class_date_start,
          class_date_finish,
          class_state,
        },
      },
    });
  } catch (err) {
    console.error("Error creating classroom", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating classroom" });
  }
};

const updateClassroom = async (req, res) => {
  try {
    const {
      class_id,
      class_subject,
      class_date_start,
      class_date_finish,
      class_state,
    } = req.body;
    const ac_preview = await client.query(
      "select*from classroom where class_id = $1",
      [class_id]
    );
    const result = await client.query(
      "UPDATE public.classroom SET class_subject = $1, class_date_start = $2, class_date_finish = $3, class_state = $4 WHERE class_id = $5 RETURNING *",
      [
        class_subject,
        class_date_start,
        class_date_finish,
        class_state,
        class_id,
      ]
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
      message: "Classroom Updated successfully",
      body: {
        classroom: {
          class_id,
          class_subject,
          class_date_start,
          class_date_finish,
          class_state,
        },
      },
    });
  } catch (err) {
    console.error("Error updating classroom", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating classroom" });
  }
};

export { getClassroom, getClassroomById, creatClassroom, updateClassroom };
