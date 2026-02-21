const db = require('../config/db');

// @route   GET /api/notifications
// @desc    Get notifications for user based on role
const getNotifications = async (req, res) => {
    try {
        const { role } = req.user;
        
        // Both see only notifications specifically addressed to them
        const result = await db.query(
            'SELECT n.*, u.name as sender_name, u.email as sender_email, u.role as sender_role FROM notifications n JOIN users u ON n.sender_id = u.id WHERE n.recipient_role = $1 AND n.is_read = false ORDER BY n.created_at DESC',
            [role]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/notifications/approve/:id
// @desc    Approve a user signup request
const approveUser = async (req, res) => {
    const { id } = req.params; // target_user_id
    const { action } = req.body; // 'Approved' or 'Rejected'
    
    try {
        const adminUser = req.user;
        
        // Find the target user
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const targetUser = userResult.rows[0];
        
        // Strict Authorization Logic
        let canHandle = false;
        if (adminUser.role === 'CEO' && targetUser.role === 'Manager') {
            canHandle = true; // CEO only accepts/rejects Managers
        } else if (adminUser.role === 'Manager') {
            const staffRoles = ['Dispatcher', 'Finance', 'Safety Officer'];
            if (staffRoles.includes(targetUser.role)) {
                canHandle = true; // Managers handle the other 3
            }
        }

        if (!canHandle) {
            return res.status(403).json({ error: 'Permission denied. You cannot approve/reject this role.' });
        }

        // Update user status
        await db.query('UPDATE users SET status = $1 WHERE id = $2', [action, id]);

        // Mark the specific signup notification as read
        await db.query('UPDATE notifications SET is_read = true WHERE target_user_id = $1 AND type = \'SIGNUP_REQUEST\'', [id]);

        // Notify CEO if a Manager accepted a staff member
        if (adminUser.role === 'Manager' && action === 'Approved') {
            const ceoMessage = `Manager ${adminUser.name} has approved ${targetUser.role}: ${targetUser.name}`;
            await db.query(
                'INSERT INTO notifications (recipient_role, sender_id, message, type, target_user_id) VALUES ($1, $2, $3, $4, $5)',
                ['CEO', adminUser.id, ceoMessage, 'ADMIN_ACTION', targetUser.id]
            );
        }

        res.json({ message: `User ${targetUser.name} has been ${action}.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/notifications/read/:id
// @desc    Mark an informational notification as read (The "OK" button)
const markNotificationRead = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE notifications SET is_read = true WHERE id = $1', [id]);
        res.json({ message: 'Notification dismissed.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/notifications/user/:id
// @desc    Remove a user (Hierarchy: CEO > Manager > Staff)
const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        const adminUser = req.user;
        
        // Find the target user
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const targetUser = userResult.rows[0];

        // Authorization Logic
        let allowed = false;
        
        if (adminUser.role === 'CEO') {
            // CEO can remove anyone except themselves
            if (adminUser.id !== targetUser.id) allowed = true;
        } else if (adminUser.role === 'Manager') {
            // Manager can remove Dispatcher, Finance, Safety Officer
            const subordinateRoles = ['Dispatcher', 'Finance', 'Safety Officer'];
            if (subordinateRoles.includes(targetUser.role)) allowed = true;
        }

        if (!allowed) {
            return res.status(403).json({ error: 'Access denied. You do not have permission to remove this user.' });
        }

        // Delete user (cascade will handle notifications)
        await db.query('DELETE FROM users WHERE id = $1', [id]);

        res.json({ message: `User ${targetUser.name} has been removed successfully.` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getNotifications,
    approveUser,
    deleteUser,
    markNotificationRead
};
