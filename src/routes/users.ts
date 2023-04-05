import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../db";
import { UserInput } from "../models/User";

const router = express.Router();
const usersCollection = "users";
const jwtSecret = process.env.JWT_SECRET || '';

router.post('/register', async (req, res) => {
    const userInput: UserInput = req.body;
    const db = await getDb();

    // Check if user exists
    const existingUser = await db.collection(usersCollection).findOne({ email: userInput.email });
    if (existingUser) {
        return res.status(409).send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userInput.password, 10);

    // Store user in DB
    const result = await db.collection(usersCollection).insertOne({ ...userInput, password: hashedPassword });

    // Generate JWT
    const token = jwt.sign({ _id: result.insertedId, email: userInput.email }, jwtSecret, { expiresIn: '1h' });

    // Sent JWT to client
    res.status(201).send({ token });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = await getDb();

    // Find user
    const user = await db.collection(usersCollection).findOne({ email });
    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).send('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });

    // Sent JWT to client
    res.send({ token });
});

export default router;
