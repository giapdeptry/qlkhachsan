const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String,
        fullName: String,
        role: String,
    },
    { collection: 'users' }
);

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect(process.env.CONNECT_DB);
        console.log('Connected to MongoDB');

        const users = await User.find().select('email fullName role');
        console.log('\n=== Users in Database ===');
        console.log(JSON.stringify(users, null, 2));

        const adminUsers = await User.find({ role: 'admin' }).select('email fullName');
        console.log('\n=== Admin Users ===');
        console.log(JSON.stringify(adminUsers, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
