const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Hash password using SHA-256
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Validation middleware
const validateUser = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateUserUpdate = [
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await prisma.user.findMany({
            skip,
            take: parseInt(limit),
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                _count: {
                    select: { notes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.user.count();

        const sanitizedUsers = users.map(user => ({
            ...user,
            id: user.id.toString(),
            _count: {
                notes: Number(user._count.notes)
            }
        }));

        res.json({
            users: sanitizedUsers,
            pagination: {
                total: Number(total),
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                notes: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Convert BigInt to string for JSON serialization
        user.id = user.id.toString();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST /api/users - Create new user
router.post('/', validateUser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password } = req.body;

        // Hash password using SHA-256
        const hashedPassword = hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true
            }
        });

        // Convert BigInt to string
        user.id = user.id.toString();

        res.status(201).json(user);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUserUpdate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { email, username, password } = req.body;

        const updateData = { email, username };

        if (password) {
            updateData.password = hashPassword(password);
        }

        const user = await prisma.user.update({
            where: { id: BigInt(id) },
            data: updateData,
            select: {
                id: true,
                email: true,
                username: true,
                updatedAt: true
            }
        });

        user.id = user.id.toString();

        res.json(user);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: BigInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
