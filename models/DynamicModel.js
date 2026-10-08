const mongoose = require('mongoose');

/**
 * Dynamically gets or creates a Mongoose model for a specific collection.
 * Uses strict: false to allow flexible schema-less JSON storage.
 * @param {string} collectionName 
 * @returns {mongoose.Model}
 */
const getDynamicModel = (collectionName) => {
    // Check if the model already exists to avoid OverwriteModelError
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }

    // Create a generic schema with strict: false
    const dynamicSchema = new mongoose.Schema({}, { 
        strict: false, 
        timestamps: true,
        versionKey: false 
    });

    return mongoose.model(collectionName, dynamicSchema, collectionName);
};

module.exports = getDynamicModel;
