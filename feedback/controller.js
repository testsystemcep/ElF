const Feedback = require('../models/Feedback');
const { sendResponse } = require('../utils/response');

const submitFeedback = async (req, res) => {
  const { name, email, message, userId } = req.body;
  const uid = userId || (req.user ? req.user.uid : 'anonymous');

  if (!message) {
    return sendResponse(res, 400, false, "Feedback message is required");
  }

  try {
    const feedback = new Feedback({
      userId: uid,
      name: name,
      email: email,
      message,
    });

    await feedback.save();

    return sendResponse(res, 201, true, "Feedback submitted successfully", feedback);
  } catch (err) {
    return sendResponse(res, 500, false, `Feedback Error: ${err.message}`);
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "Feedback fetched successfully", feedback);
  } catch (err) {
    return sendResponse(res, 500, false, `Get Feedback Error: ${err.message}`);
  }
};

module.exports = { submitFeedback, getFeedback };
