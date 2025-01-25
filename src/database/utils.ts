import { Db, MongoClient } from "mongodb";

export const connectToDatabase = async (client: MongoClient) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('duval');
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

export const getUser = async (db: Db, name: string) => {
    try {
        const regex = new RegExp(name, 'i');
        const result = await db.collection("data").find({ "parties.name": { $regex: regex } }).toArray();
        return result;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
