require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const { connectDB } = require('./utils/mongodb');

async function seed() {
    try {
        await connectDB();
        const superAdmin = {
            username: 'admin@notehub',
            password: 'tuKon@123',
            role: 'super_admin',
            adminClass: null
        };

        const classAdmin = {
            username: 'ayush@123',
            password: 'Notehub@123',
            role: 'class_admin',
            adminClass: 'FYCS'
        };

        const admins = [superAdmin, classAdmin];

        for (const a of admins) {
            const exists = await Admin.findOne({ username: a.username });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(a.password, 10);
                await Admin.create({ ...a, password: hashedPassword });
                console.log(`Created admin: ${a.username}`);
            } else {
                console.log(`Admin already exists: ${a.username}`);
            }
        }

        console.log('Seeding completed.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
