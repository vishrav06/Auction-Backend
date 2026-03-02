import { pool } from "./pool";

const connectDB = async () =>{
    try {
        await pool.query('SELECT 1');
        console.log('✅ PostgreSQL connected successfully');
    } catch (err) {
        console.error('❌ PostgreSQL connection failed', err);
        process.exit(1);        
    }
}

export {connectDB};