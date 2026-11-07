
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import Notice from './models/Notice.js';
import Assignment from './models/Assignment.js';

const app = express();
const PORT = 5000;

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

app.get('/clubs', (req, res) => {
    res.json(clubs);
});

app.get('/clubs/:id', (req, res) => {
    const club = clubs.find(c => c.id === Number(req.params.id));

    if (!club) {
        return res.status(404).json({ message: "Club not found" });
    }

    res.json(club);
});

app.post('/clubs', (req, res) => {
    const newClub = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description
    };

    clubs.push(newClub);
    res.status(201).json(newClub);
});

app.put('/clubs/:id', (req, res) => {
    const club = clubs.find(c => c.id === Number(req.params.id));

    if (!club) {
        return res.status(404).json({ message: "Club not found" });
    }

    club.name = req.body.name;
    club.description = req.body.description;

    res.json(club);
});

app.delete('/clubs/:id', (req, res) => {
    const id = Number(req.params.id);
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

// Connect MongoDB and start server
mongoose.connect('mongodb://127.0.0.1:27017/collegeDB')
    .then(() => {
        console.log('MongoDB connected successfully!');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });
