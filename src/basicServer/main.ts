import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { connectToDatabase, getUser } from "../database/utils";
import path from "node:path";

const app = express();
const PORT = 3000;

// Create a MongoClient instance
const client = new MongoClient("mongodb://localhost:27017");

app.use(express.static(path.join(__dirname, 'public')));

//@ts-ignore
app.get("/api/user", async (req, res) => {
    const name = req.query.name as string; 
    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    try {
        const db = await connectToDatabase(client);
        const user = await getUser(db, name);
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
