const Schedule = require('../models/Schedule');
const { sendResponse } = require('../utils/response');

const getSchedule = async (req, res) => {
  const { studentClass, class: queryClass, date } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;
    if (date) query.date = date;

    const schedule = await Schedule.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "Schedule fetched successfully", schedule);
  } catch (err) {
    return sendResponse(res, 500, false, `Schedule Error: ${err.message}`);
  }
};

const addSchedule = async (req, res) => {
  const { class: studentClass, date, teacher, subject, start_time, end_time, room } = req.body;
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { class: studentClass, date: date },
      {
        $push: {
          schedule: {
            teacher: teacher || "",
            subject,
            start_time,
            end_time,
            room: room || ""
          }
        }
      },
      { upsert: true, new: true }
    );
    return sendResponse(res, 201, true, "Schedule added successfully", updatedSchedule);
  } catch (err) {
    return sendResponse(res, 500, false, `Add Schedule Error: ${err.message}`);
  }
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { teacher, subject, start_time, end_time, room, ...otherFields } = req.body;
  try {
    let updateQuery;
    // If the frontend is adding a lecture via Edit form, push it instead of rewriting root
    if (subject || start_time || end_time) {
      updateQuery = { 
        $set: otherFields, 
        $push: { schedule: { teacher: teacher || "", subject, start_time, end_time, room: room || "" } } 
      };
    } else {
      updateQuery = { $set: req.body };
    }

    const schedule = await Schedule.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!schedule) return sendResponse(res, 404, false, "Schedule not found");
    return sendResponse(res, 200, true, "Schedule updated successfully", schedule);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Schedule Error: ${err.message}`);
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  const { lectureId } = req.query;
  try {
    if (lectureId) {
      const schedule = await Schedule.findByIdAndUpdate(
        id,
        { $pull: { schedule: { _id: lectureId } } },
        { new: true }
      );
      if (!schedule) return sendResponse(res, 404, false, "Schedule not found");
      
      // If the schedule list is now empty, delete the main document entirely
      if (schedule.schedule.length === 0) {
        await Schedule.findByIdAndDelete(id);
      }
      
      return sendResponse(res, 200, true, "Lecture deleted successfully", schedule);
    } else {
      const schedule = await Schedule.findByIdAndDelete(id);
      if (!schedule) return sendResponse(res, 404, false, "Schedule not found");
      return sendResponse(res, 200, true, "Entire day's schedule deleted successfully");
    }
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Schedule Error: ${err.message}`);
  }
};

module.exports = { getSchedule, addSchedule, updateSchedule, deleteSchedule };
