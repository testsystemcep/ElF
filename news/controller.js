const News = require('../models/News');
const { sendResponse } = require('../utils/response');

const getNews = async (req, res) => {
  const { studentClass, class: queryClass } = req.query;
  const targetClass = studentClass || queryClass;

  try {
    const query = {};
    if (targetClass) query.class = targetClass;

    const newsList = await News.find(query).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, "News fetched successfully", newsList);
  } catch (err) {
    return sendResponse(res, 500, false, `News Fetch Error: ${err.message}`);
  }
};

const addNews = async (req, res) => {
  try {
    const { class: classField, imageUrl, title, date, description } = req.body;
    const newsItem = new News({
      class: classField,
      imageUrl,
      title,
      date,
      description
    });
    await newsItem.save();
    return sendResponse(res, 201, true, "News added successfully", newsItem);
  } catch (err) {
    return sendResponse(res, 500, false, `Add News Error: ${err.message}`);
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    if (req.body.class !== undefined) {
      updateData.class = req.body.class;
    }
    
    const newsItem = await News.findByIdAndUpdate(id, updateData, { new: true });
    if (!newsItem) return sendResponse(res, 404, false, "News not found");
    return sendResponse(res, 200, true, "News updated successfully", newsItem);
  } catch (err) {
    return sendResponse(res, 500, false, `Update News Error: ${err.message}`);
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const newsItem = await News.findByIdAndDelete(id);
    if (!newsItem) return sendResponse(res, 404, false, "News not found");
    return sendResponse(res, 200, true, "News deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, `Delete News Error: ${err.message}`);
  }
};

module.exports = { getNews, addNews, updateNews, deleteNews };
