import { Client } from "pg";
import "dotenv/config";

export const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
});

export const connectDataBase = async () => {
    try {
        await client.connect();
        console.log('Database sucessfully connected.')
    } catch (error) {
        console.log(error);
    }
}

export const creatDatabaseTable = async () => {
    try {
        const query = ` DROP TABLE IF EXISTS movies;
        CREATE TABLE IF NOT EXISTS movies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            category VARCHAR(20),
            duration INTEGER,
            price INTEGER
        );`
        await client.query(query);
        console.log("Tables created sucessfully")
    } catch (error) {
        console.log(error);
    }
}