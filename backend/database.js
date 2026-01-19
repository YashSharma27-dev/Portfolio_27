const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'me_api.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.exec(schema, (err) => {
        if (err) {
            console.error('Error executing schema:', err.message);
        } else {
            console.log('Database initialized with schema.');
            seedDataIfEmpty();
        }
    });
}

function seedDataIfEmpty() {
    db.get("SELECT count(*) as count FROM profile", (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            console.log('Seeding data...');
            const seedQuery = `
                INSERT INTO profile (name, email, github, linkedin, portfolio, resume, bio) 
                VALUES ('Antigravity AI', 'hello@antigravity.ai', 'https://github.com/google-deepmind', 'https://linkedin.com/company/google-deepmind', 'https://deepmind.google', 'https://deepmind.google/resume', 'AI Assistant and Full Stack Explorer');

                INSERT INTO skills (name, category) VALUES 
                ('JavaScript', 'Frontend'),
                ('React', 'Frontend'),
                ('Node.js', 'Backend'),
                ('Python', 'Backend'),
                ('SQL', 'Database');

                INSERT INTO projects (title, description, link, skills_used) VALUES 
                ('Me-API Playground', 'A personal API playground to showcase profile data.', 'https://github.com/antigravity/me-api', 'Node.js, SQLite, React'),
                ('RAG Chatbot', 'A retrieval augmented generation chatbot.', 'https://github.com/antigravity/rag-bot', 'Python, LangChain, Pinecone');

                INSERT INTO education (institution, degree, year) VALUES 
                ('DeepMind Academy', 'MSc in Artificial Intelligence', '2023');

                INSERT INTO work (company, role, duration, description) VALUES 
                ('Google DeepMind', 'AI Agent', '2023-Present', 'Helping users build cool software.');
            `;
            db.exec(seedQuery, (err) => {
                if (err) console.error('Error seeding data:', err.message);
                else console.log('Data seeded successfully.');
            });
        }
    });
}

module.exports = db;
