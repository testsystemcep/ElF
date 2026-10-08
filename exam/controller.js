const Exam = require('../models/Exam');
const { sendResponse } = require('../utils/response');

const getExamTimetable = async (req, res) => {
  const { className, studentClass, class: queryClass } = req.query;
  const targetClass = className || studentClass || queryClass;

  console.log(`[GET /exams] Query Params:`, req.query);
  console.log(`[GET /exams] Target Class:`, targetClass);

  try {
    let query = {};
    if (targetClass) {
      // Case-insensitive search for className
      query.className = { $regex: new RegExp(`^${targetClass}$`, 'i') };
    }

    const exams = await Exam.find(query).sort({ date: 1 }); // Sort by date
    
    console.log(`[GET /exams] Found ${exams.length} records`);
    return sendResponse(res, 200, true, "Exam timetables fetched successfully", exams);
  } catch (err) {
    console.error(`[GET /exams] Error:`, err.message);
    return sendResponse(res, 500, false, `Exams Error: ${err.message}`);
  }
};

const addExam = async (req, res) => {
  console.log(`[POST /exams] Incoming Body:`, req.body);
  
  try {
    // Basic validation log
    const { className, subject, date, time, room } = req.body;
    if (!className || !subject || !date || !time || !room) {
      console.warn(`[POST /exams] Missing required fields in body`);
    }

    const exam = new Exam(req.body);
    const savedExam = await exam.save();
    
    console.log(`[POST /exams] Save Success:`, savedExam);
    return sendResponse(res, 201, true, "Exam added successfully", savedExam);
  } catch (err) {
    console.error(`[POST /exams] Save Error:`, err.message);
    return sendResponse(res, 500, false, `Add Exam Error: ${err.message}`);
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
    if (!exam) return sendResponse(res, 404, false, "Exam not found");
    return sendResponse(res, 200, true, "Exam updated successfully", exam);
  } catch (err) {
    return sendResponse(res, 500, false, `Update Exam Error: ${err.message}`);
  }
};

const deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) return sendResponse(res, 404, false, "Exam not found");
    return sendResponse(res, 200, true, "Exam deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete Exam Error: ${err.message}`);
  }
};

module.exports = { getExamTimetable, addExam, updateExam, deleteExam };
