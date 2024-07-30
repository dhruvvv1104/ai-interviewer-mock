/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:m8d2tOAYblNz@ep-small-breeze-a5hcrym1.us-east-2.aws.neon.tech/ai-interview-mock?sslmode=require',
    }
  };