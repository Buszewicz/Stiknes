const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// === VALIDATORS ===
const validateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').isInt().withMessage('Valid user ID is required')
];

const validateNoteUpdate = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('userId').optional().isInt().withMessage('Valid user ID is required')
];

// === GET ALL NOTES ===
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = userId ? { userId: parseInt(userId) } : {};

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

        res.json({
            notes: notes.map(note => ({
                ...note,
                id: note.id.toString(),
                userId: note.userId.toString(),
                user: {
                    ...note.user,
                    id: note.user.id.toString()
                }
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('GET /notes error:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// === GET NOTE BY ID ===
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const note = await prisma.note.findUnique({
            where: { id },
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

        res.json({
            ...note,
            id: note.id.toString(),
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        });
    } catch (error) {
        console.error('GET /notes/:id error:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// === CREATE NOTE ===
router.post('/', validateNote, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, userId } = req.body;
        const userIdInt = parseInt(userId);

        const userExists = await prisma.user.findUnique({ where: { id: userIdInt } });
        if (!userExists) {
            return res.status(400).json({ error: 'User not found' });
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId: userIdInt
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

        res.status(201).json({
            ...note,
            id: note.id.toString(),
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        });
    } catch (error) {
        console.error('POST /notes error:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

// === UPDATE NOTE ===
router.put('/:id', validateNoteUpdate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);
        const { title, content, userId } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        if (userId !== undefined) {
            const userIdInt = parseInt(userId);
            const userExists = await prisma.user.findUnique({ where: { id: userIdInt } });
            if (!userExists) {
                return res.status(400).json({ error: 'User not found' });
            }
            updateData.userId = userIdInt;
        }

        const note = await prisma.note.update({
            where: { id },
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

        res.json({
            ...note,
            id: note.id.toString(),
            userId: note.userId.toString(),
            user: {
                ...note.user,
                id: note.user.id.toString()
            }
        });
    } catch (error) {
        console.error('PUT /notes/:id error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// === DELETE NOTE ===
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.note.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        console.error('DELETE /notes/:id error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
