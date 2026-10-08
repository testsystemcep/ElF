const Imp = require('../models/Imp');
const { sendResponse } = require('../utils/response');

const getImps = async (req, res) => {
  const { studentClass, class: queryClass, subject } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;
    if (subject) query.subject = subject;

    const imps = await Imp.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "IMPs fetched successfully", imps);
  } catch (err) {
    return sendResponse(res, 500, false, `IMPs Fetch Error: ${err.message}`);
  }
};

const addImp = async (req, res) => {
  try {
    const { class: classField, subject, examName, type, pdfUrl } = req.body;
    const imp = new Imp({
      class: classField,
      subject,
      examName,
      type,
      pdfUrl
    });
    await imp.save();
    return sendResponse(res, 201, true, "IMP added successfully", imp);
  } catch (err) {
    return sendResponse(res, 500, false, `Add IMP Error: ${err.message}`);
  }
};

const updateImp = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    if (req.body.class !== undefined) {
      updateData.class = req.body.class;
    }
    
    const imp = await Imp.findByIdAndUpdate(id, updateData, { new: true });
    if (!imp) return sendResponse(res, 404, false, "IMP not found");
    return sendResponse(res, 200, true, "IMP updated successfully", imp);
  } catch (err) {
    return sendResponse(res, 500, false, `Update IMP Error: ${err.message}`);
  }
};

const deleteImp = async (req, res) => {
  const { id } = req.params;
  try {
    const imp = await Imp.findByIdAndDelete(id);
    if (!imp) return sendResponse(res, 404, false, "IMP not found");
    return sendResponse(res, 200, true, "IMP deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete IMP Error: ${err.message}`);
  }
};

module.exports = { getImps, addImp, updateImp, deleteImp };
