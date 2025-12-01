import mongoose from 'mongoose';
import User from '../app/lib/db/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function listUsers() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email username createdAt');

        console.log('\n--- Registered Users ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.table(users.map(u => ({
                Name: u.name,
                Email: u.email,
                Username: u.username || '(none)',
                Joined: new Date(u.createdAt).toLocaleDateString()
            })));
        }
        console.log('------------------------\n');

    } catch (error) {
        console.error('Error listing users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

listUsers();
