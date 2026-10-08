const getDynamicModel = require('../models/DynamicModel');

/**
 * Universal controller to handle dynamic CRUD operations.
 */
const handleUniversalRequest = async (req, res) => {
    try {
        const { action, collection, data, query, options } = req.body;

        if (!action || !collection) {
            return res.status(400).json({
                success: false,
                message: "Missing 'action' or 'collection' in request body."
            });
        }

        const Model = getDynamicModel(collection);
        let result;

        switch (action.toLowerCase()) {
            case 'create':
            case 'save':
                if (Array.isArray(data)) {
                    result = await Model.insertMany(data);
                } else {
                    result = await Model.create(data);
                }
                break;

            case 'read':
            case 'get':
                const findQuery = query || {};
                const projection = options?.projection || {};
                const sort = options?.sort || { createdAt: -1 };
                const limit = options?.limit || 0;
                const skip = options?.skip || 0;

                result = await Model.find(findQuery, projection)
                    .sort(sort)
                    .limit(limit)
                    .skip(skip);
                break;

            case 'update':
                if (!query) {
                    return res.status(400).json({
                        success: false,
                        message: "Update action requires a 'query' object (e.g., { _id: '...' })."
                    });
                }
                // Use { new: true } to return the updated document
                result = await Model.updateMany(query, { $set: data }, { new: true, upsert: options?.upsert || false });
                break;

            case 'delete':
                if (!query) {
                    return res.status(400).json({
                        success: false,
                        message: "Delete action requires a 'query' object."
                    });
                }
                result = await Model.deleteMany(query);
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: `Invalid action: ${action}. Supported actions: create, read, update, delete.`
                });
        }

        res.status(200).json({
            success: true,
            message: `Action '${action}' performed successfully on collection '${collection}'.`,
            count: Array.isArray(result) ? result.length : (result.deletedCount || result.modifiedCount || 1),
            data: result
        });

    } catch (error) {
        console.error("Universal API Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    handleUniversalRequest
};
