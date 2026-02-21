const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check account status
        if (user.status === 'Pending') {
            return res.status(403).json({ 
                error: 'Your account request is currently in process. Please wait for administrator approval.',
                status: 'Pending'
            });
        }
        if (user.status === 'Rejected') {
            return res.status(403).json({ error: 'Your account request has been rejected.' });
        }

        const payload = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: payload
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/auth/signup
// @desc    Register a new user (Pending Approval)
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Validate role
        const validRoles = ['Manager', 'Dispatcher', 'Finance', 'Safety Officer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role selected.' });
        }

        // Check if user exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await db.query(
            'INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, password_hash, role, 'Pending']
        );

        const user = newUser.rows[0];

        // Create Notification for approval
        const recipientRole = (role === 'Manager') ? 'CEO' : 'Manager';
        const message = `New ${role} signup request: ${name} (${email})`;

        await db.query(
            'INSERT INTO notifications (recipient_role, sender_id, message, target_user_id) VALUES ($1, $2, $3, $4)',
            [recipientRole, user.id, message, user.id]
        );

        res.status(201).json({
            message: 'Signup request submitted successfully. Please wait for administrator approval.',
            status: 'Pending'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/auth/me
// @desc    Get current user
const getMe = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/auth/users
// @desc    Get all users (for management)
const getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, status, created_at FROM users ORDER BY role, name');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    login,
    signup,
    getMe,
    getUsers
};
