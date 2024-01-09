import { client } from "../database/database.js";
import { postAuditing } from "./auditing.controller.js";
const getAssigmentEvents = async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM assignments_events ");
    res.json(response.rows);
  } catch (err) {
    console.error("Error getting getAssigmentEvents", err);
    res
      .status(500)
      .json({ error: "An error occurred while getting assignments_events" });
  }
};

const getAssigmentEventsById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await client.query(
      "SELECT * FROM assignments_events WHERE assignment_event_id = $1",
      [id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error("Error getting assignments_events by id", err);
    res.status(500).json({
      error: "An error occurred while getting assignments_events by id",
    });
  }
};

const createAssigmentEvent = async (req, res) => {
  try {
    console.log(req.body); // Agrega este console.log para depurar
    const { event_id, user_id } = req.body;
    const result = await client.query(
      "INSERT INTO public.assignments_events (event_id, user_id) VALUES ($1, $2) RETURNING *",
      [event_id, user_id]
    );
    const assignment_event_id = result.rows[0].assignment_event_id; // Get the automatically generated class_id
    var audit_operation = result.command;
    var audit_affected_table = "assignments_events";
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
    //const newEvent = response.rows[0];
    res.json({
      message: "Event added successfully",
      body: {
        event: {
          assignment_event_id,
          event_id,
          user_id,
        },
      },
    });
  } catch (err) {
    console.error("Error creating assigmentevent", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the assigmentevent" });
  }
};

const updateAssigmentEvent = async (req, res) => {
  try {
    const { assignment_event_id, event_id, user_id } = req.body;
    const ac_preview = await client.query(
      "select*from assignments_events where assignment_event_id = $1",
      [assignment_event_id]
    );
    const result = await client.query(
      "UPDATE public.assignments_events SET event_id = $1, user_id = $2 WHERE assignment_event_id = $3 RETURNING *",
      [event_id, user_id, assignment_event_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const updatedEvent = result.rows[0];

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
      message: "Event updated successfully",
      body: {
        event: updatedEvent,
      },
    });
  } catch (err) {
    console.error("Error updating event", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the event" });
  }
};

const deleteAssigmentEvent = async (req, res) => {
  try {
    const assignment_event_id = req.params.id; // Obtener el ID de los parámetros de la ruta
    const ac_preview = await client.query(
      "select*from assignments_events where assignment_event_id = $1",
      [assignment_event_id]
    );
    const result = await client.query(
      "DELETE FROM public.assignments_events WHERE assignment_event_id = $1 RETURNING *",
      [assignment_event_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "AssignmentEvent not found" });
    }

    const deletedAssignmentEvent = result.rows[0];
    var audit_operation = result.command;
    var audit_affected_table = "assignments_events";
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
    res.json({
      message: "AssignmentEvent deleted successfully",
      body: {
        assignment_event: deletedAssignmentEvent,
      },
    });
  } catch (err) {
    console.error("Error deleting assignment_event", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the assignment_event" });
  }
};

export {
  getAssigmentEvents,
  getAssigmentEventsById,
  createAssigmentEvent,
  updateAssigmentEvent,
  deleteAssigmentEvent,
};
