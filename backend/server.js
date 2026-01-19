const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React frontend app
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Helper for database queries
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};


const runPromise = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

// --- Endpoints ---

// 1. Health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 2. Profile
app.get('/profile', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM profile LIMIT 1');
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/profile', async (req, res) => {
    const { name, email, github, linkedin, portfolio, resume, bio } = req.body;
    try {
        await runPromise(
            `UPDATE profile SET name=?, email=?, github=?, linkedin=?, portfolio=?, resume=?, bio=? WHERE id=1`, // Assuming single profile
            [name, email, github, linkedin, portfolio, resume, bio]
        );
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Projects
app.get('/projects', async (req, res) => {
    const { skill } = req.query;
    try {
        let sql = 'SELECT * FROM projects';
        let params = [];
        if (skill) {
            sql += ' WHERE skills_used LIKE ?';
            params.push(`%${skill}%`);
        }
        const rows = await query(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/projects', async (req, res) => {
    const { title, description, link, skills_used } = req.body;
    try {
        const result = await runPromise(
            'INSERT INTO projects (title, description, link, skills_used) VALUES (?, ?, ?, ?)',
            [title, description, link, skills_used]
        );
        res.json({ id: result.lastID, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Skills
app.get('/skills', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM skills');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/skills/top', async (req, res) => {
    // Mock "top" skills logic, or just limit 5
    try {
        const rows = await query('SELECT * FROM skills LIMIT 5');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Education
app.get('/education', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM education');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Work
app.get('/work', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM work');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Achievements
app.get('/achievements', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM achievements');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Certifications
app.get('/certifications', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM certifications');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Search (generic search across projects and skills)
app.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ projects: [], skills: [] });

    try {
        const projects = await query('SELECT * FROM projects WHERE title LIKE ? OR description LIKE ?', [`%${q}%`, `%${q}%`]);
        const skills = await query('SELECT * FROM skills WHERE name LIKE ?', [`%${q}%`]);
        res.json({ projects, skills });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Anything that doesn't match the above, send back index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
