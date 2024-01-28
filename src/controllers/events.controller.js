import {client} from "../database/database.js";
import {postAuditing} from "./auditing.controller.js";
const getEvents = async (req, res) => {
  try {
    const response = await client.query("SELECT * FROM events ");
    res.json(response.rows);
  } catch (err) {
    console.error("Error getting classrooms", err);
    res.status(500).json({error: "An error occurred while getting events"});
  }
};

const getEventsById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await client.query(
      "SELECT * FROM events WHERE event_id = $1",
      [id]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error("Error getting class_score by id", err);
    res
      .status(500)
      .json({error: "An error occurred while getting class_score by id"});
  }
};

const createEvent = async (req, res) => {
  try {
    console.log(req.body); // Agrega este console.log para depurar
    const {
      event_name,
      event_date,
      event_place,
      event_description,
      event_state,
    } = req.body;
    const result = await client.query(
      "INSERT INTO public.events (event_name, event_date, event_place, event_description, event_state) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [event_name, event_date, event_place, event_description, event_state]
    );
    const event_id = result.rows[0].event_id; // Get the automatically generated class_id
    var audit_operation = result.command;
    var audit_affected_table = "events";
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
          event_id,
          event_name,
          event_date,
          event_place,
          event_description,
          event_state,
        },
      },
    });
  } catch (err) {
    console.error("Error creating event", err);
    res
      .status(500)
      .json({error: "An error occurred while creating the event"});
  }
};

const updateEvent = async (req, res) => {
  try {
    const {
      event_id,
      event_name,
      event_date,
      event_place,
      event_description,
      event_state,
    } = req.body;
    const fecha = convertirStringAFecha(event_date);
    const ac_preview = await client.query(
      "select*from events where event_id = $1",
      [event_id]
    );
    const result = await client.query(
      "UPDATE public.events SET event_name = $1, event_date = $2, event_place = $3, event_description = $4, event_state = $5 WHERE event_id = $6 RETURNING *",
      [
        event_name,
        fecha,
        event_place,
        event_description,
        event_state,
        event_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: "Event not found"});
    }

    const updatedEvent = result.rows[0];
    var audit_operation = result.command;
    var audit_affected_table = "events";
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
      .json({error: "An error occurred while updating the event " + fecha});
  }
};

export {getEvents, getEventsById, createEvent, updateEvent};
