const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './.env' });

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, require: true },
        email: { type: String, require: true },
        password: { type: String, require: true },
        isAdmin: { type: Boolean, default: false },
        address: { type: String, require: false, default: '' },
        phone: { type: String, require: false, default: '' },
        birthDay: { type: Date, require: false, default: null },
        typeLogin: { type: String, enum: ['email', 'google'] },
        avatar: { type: String, require: false, default: '' },
    },
    {
        timestamps: true,
        collection: 'users'
    }
);

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.CONNECT_DB);
        console.log('Connected to MongoDB');

        // Create admin user
        const email = 'admin@test.com';
        const password = 'admin123';
        const fullName = 'Admin User';

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const adminUser = new User({
            email,
            password: hashedPassword,
            fullName,
            isAdmin: true,
            typeLogin: 'email'
        });

        await adminUser.save();
        console.log('\n✅ Admin user created successfully!');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('isAdmin: true');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

createAdminUser();
