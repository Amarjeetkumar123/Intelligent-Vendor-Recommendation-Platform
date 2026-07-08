import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Must load env vars BEFORE creating the pool

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

async function connectDatabase() {
    try {
        await pool.query("SELECT NOW()")
        console.log("database connected successfully")
    } catch (error: any) {
        console.error("Failed to connect to database",error)
    }
}

export default connectDatabase;
