import dotenv from 'dotenv';

// Load environment variables from .env file into process.env, and suppress warnings if the .env file is missing
dotenv.config({quiet: true}); 

// Export the environment variables as a typed object for use throughout the application
export const ENV = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV, 
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY, 
    FRONTEND_URL: process.env.FRONTEND_URL,
}