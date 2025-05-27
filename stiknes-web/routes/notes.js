const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').isNumeric().withMessage('Valid user ID is required')
];

const validateNoteUpdate = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('userId').optional().isNumeric().withMessage('Valid user ID is required')
];

// GET /api/notes - Get all notes
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = userId ? { userId: BigInt(userId) } : {};

        const notes = await prisma.note.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.note.count({ where });

        // Convert BigInt to string
        const serializedNotes = notes.map(note => ({
            ...note,
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        }));

        res.json({
            notes: serializedNotes,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// GET /api/notes/:id - Get note by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            }
        });

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Convert BigInt to string
        const serializedNote = {
            ...note,
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        };

        res.json(serializedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// POST /api/notes - Create new note
router.post('/', validateNote, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, userId } = req.body;

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: BigInt(userId) }
        });

        if (!userExists) {
            return res.status(400).json({ error: 'User not found' });
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId: BigInt(userId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            }
        });

        // Convert BigInt to string
        const serializedNote = {
            ...note,
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        };

        res.status(201).json(serializedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// PUT /api/notes/:id - Update note
router.put('/:id', validateNoteUpdate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, content, userId } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (userId !== undefined) {
            // Check if user exists
            const userExists = await prisma.user.findUnique({
                where: { id: BigInt(userId) }
            });

            if (!userExists) {
                return res.status(400).json({ error: 'User not found' });
            }

            updateData.userId = BigInt(userId);
        }

        const note = await prisma.note.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                }
            }
        });

        // Convert BigInt to string
        const serializedNote = {
            ...note,
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        };

        res.json(serializedNote);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.note.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;