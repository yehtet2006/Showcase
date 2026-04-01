import dotenv from 'dotenv';

dotenv.config({quiet: true}); // Load environment variables from .env file into process.env, and suppress warnings if the .env file is missing

export const ENV = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV, 
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY, 
    FRONTEND_URL: process.env.FRONTEND_URL
}