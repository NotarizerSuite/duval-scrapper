import { MongoClient } from "mongodb";
import { processJsonFile } from "./parser";
import { connectToDatabase } from "../database/utils";

const main = async () => {
    const uri = "mongodb://localhost:27017/";
    const client = new MongoClient(uri);

    try {
        const db = await connectToDatabase(client);
        console.log('Connected to MongoDB');

        await processJsonFile("result.json", db).then(() => console.log("DONE"));
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
    }
};

main().catch(console.error);
