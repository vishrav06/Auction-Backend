// import dotenv from "dotenv";

// dotenv.config({path: './.env'});

import { connectDB } from "./db/index";
import { app } from "./app";

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`📍 Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error("PostgreSQL connection failed !!", err);
});