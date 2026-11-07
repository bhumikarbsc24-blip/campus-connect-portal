
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import Notice from './models/Notice.js';
import Assignment from './models/Assignment.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// =====================================
// LAB 6 - CLUBS CRUD (In-memory storage)
// =====================================

let clubs = [
    { id: 1, name: "Coding Club", description: "A club for coding lovers" },
    { id: 2, name: "Music Club", description: "A club for music lovers" }
];

// GET all clubs
app.get('/clubs', (req, res) => {
    res.json(clubs);
});

// GET club by ID
app.get('/clubs/:id', (req, res) => {
    const club = clubs.find(c => c.id === Number(req.params.id));

    if (!club) {
        return res.status(404).json({ message: "Club not found" });
    }

    res.json(club);
});

// POST - Add new club
app.post('/clubs', (req, res) => {
    const newClub = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description
    };

    clubs.push(newClub);
    res.status(201).json(newClub);
});

// PUT - Update club
app.put('/clubs/:id', (req, res) => {
    const club = clubs.find(c => c.id === Number(req.params.id));

    if (!club) {
        return res.status(404).json({ message: "Club not found" });
    }

    club.name = req.body.name;
    club.description = req.body.description;

    res.json(club);
});

// DELETE club
app.delete('/clubs/:id', (req, res) => {
    const id = Number(req.params.id);
    const exists = clubs.some(c => c.id === id);

    if (!exists) {
        return res.status(404).json({ message: "Club not found" });
    }

    clubs = clubs.filter(c => c.id !== id);

    res.json({ message: "Club deleted successfully" });
});

// =====================================
// LAB 7 - NOTICES CRUD (MongoDB)
// =====================================

// GET all notices
app.get('/api/notices', async (req, res, next) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        next(error);
    }
});

// POST a new notice
app.post('/api/notices', async (req, res, next) => {
    try {
        const { title, description, department, date } = req.body;

        if (!title || !description || !department || !date) {
            return res.status(400).json({
                message: "Please fill in all notice fields"
            });
        }

        const notice = await Notice.create({
            title,
            description,
            department,
            date
        });

        res.status(201).json(notice);
    } catch (error) {
        next(error);
    }
});

// PUT - Update a notice
app.put('/api/notices/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid notice ID" });
        }

        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.json(notice);
    } catch (error) {
        next(error);
    }
});

// DELETE a notice
app.delete('/api/notices/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid notice ID" });
        }

        const notice = await Notice.findByIdAndDelete(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.json({ message: "Notice deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// =====================================
// LAB 7 - ASSIGNMENTS CRUD (MongoDB)
// =====================================

// GET all assignments
app.get('/api/assignments', async (req, res, next) => {
    try {
        const assignments = await Assignment.find().sort({ createdAt: -1 });
        res.json(assignments);
    } catch (error) {
        next(error);
    }
});

// POST a new assignment
app.post('/api/assignments', async (req, res, next) => {
    try {
        const { title, subject, description, dueDate } = req.body;

        if (!title || !subject || !description || !dueDate) {
            return res.status(400).json({
                message: "Please fill in all assignment fields"
            });
        }

        const assignment = await Assignment.create({
            title,
            subject,
            description,
            dueDate
        });

        res.status(201).json(assignment);
    } catch (error) {
        next(error);
    }
});

// PUT - Update an assignment
app.put('/api/assignments/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json(assignment);
    } catch (error) {
        next(error);
    }
});

// Submit an assignment
app.put('/api/assignments/:id/submit', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }

        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { status: "Submitted" },
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json(assignment);
    } catch (error) {
        next(error);
    }
});

// DELETE an assignment
app.delete('/api/assignments/:id', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }

        const assignment = await Assignment.findByIdAndDelete(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('Campus Connect Portal API is running!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({
        message: "Something went wrong!",
        error: err.message
    });
});

// =====================================
// MONGODB ATLAS CONNECTION
// =====================================

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Atlas connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });
