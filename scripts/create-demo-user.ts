import mongoose from 'mongoose';
import User from '../app/lib/db/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function createDemoUser() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const demoUser = {
            name: 'Demo User',
            email: 'demo@bixnemo.com',
            username: 'demobix48',
            password: 'password123', // You can change this or pass it as an arg
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };

        // Hash password
        const hashedPassword = await bcrypt.hash(demoUser.password, 10);

        // Check if user exists
        let user = await User.findOne({
            $or: [{ email: demoUser.email }, { username: demoUser.username }]
        });

        if (user) {
            console.log('Demo user already exists. Updating...');
            user.name = demoUser.name;
            user.email = demoUser.email;
            user.username = demoUser.username;
            user.password = hashedPassword;
            user.image = demoUser.image;
            await user.save();
            console.log('Demo user updated successfully.');
        } else {
            console.log('Creating new demo user...');
            await User.create({
                ...demoUser,
                password: hashedPassword
            });
            console.log('Demo user created successfully.');
        }

        console.log(`
      -----------------------------------
      Demo User Credentials:
      Username: ${demoUser.username}
      Email:    ${demoUser.email}
      Password: ${demoUser.password}
      -----------------------------------
    `);

    } catch (error) {
        console.error('Error creating demo user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createDemoUser();
