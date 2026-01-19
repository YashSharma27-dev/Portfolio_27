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
                INSERT INTO profile (name, email, phone, github, linkedin, portfolio, resume, bio) 
                VALUES (
                    'Yash Sharma', 
                    '231210127@nitdelhi.ac.in', 
                    '+91 9310241590',
                    'https://github.com/YashSharma27-dev', 
                    'https://linkedin.com/in/yashsharma', 
                    '', 
                    '#', 
                    'Motivated B.Tech CSE student at NIT Delhi with keen interest in Machine Learning, Computer Networks, and Full-Stack Web Development (MERN stack). Passionate about building innovative solutions and solving complex problems through technology. Seeking opportunities to apply and expand my technical skills in real-world projects while contributing to cutting-edge developments in AI, networking, and cybersecurity.'
                );

                INSERT INTO skills (name, category) VALUES 
                ('C', 'Programming Languages'),
                ('C++', 'Programming Languages'),
                ('JavaScript', 'Programming Languages'),
                ('Python', 'Programming Languages'),
                ('Bash scripting', 'Programming Languages'),
                ('HTML', 'Web Development'),
                ('CSS3', 'Web Development'),
                ('React', 'Web Development'),
                ('Node.js', 'Web Development'),
                ('Express.js', 'Web Development'),
                ('MySQL', 'Database'),
                ('MongoDB', 'Database'),
                ('Pandas', 'Libraries/Frameworks'),
                ('Matplotlib', 'Libraries/Frameworks'),
                ('Scikit-learn', 'Libraries/Frameworks'),
                ('NumPy', 'Libraries/Frameworks'),
                ('Seaborn', 'Libraries/Frameworks'),
                ('TensorFlow', 'Libraries/Frameworks'),
                ('Git', 'Tools'),
                ('GitHub', 'Tools'),
                ('Cisco Packet Tracer', 'Tools'),
                ('Linux', 'Tools'),
                ('VS Code', 'Tools');

                INSERT INTO projects (title, description, link, skills_used) VALUES 
                ('Portfolio', 'portfolio designed according to the requirement', 'https://github.com/YashSharma27-dev/Portfolio', 'HTML, CSS'),
                ('Mess-food-suggestion-system-with-ML-', 'Developed an ML-based system that predicts optimal food intake.', 'https://github.com/YashSharma27-dev/Mess-food-suggestion-system-with-ML-', 'Python, machine-learning'),
                ('hackathon_model', 'Model for smart code web hackathon', 'https://github.com/YashSharma27-dev/hackathon_model', 'HTML'),
                ('Dask', '', 'https://github.com/YashSharma27-dev/Dask', ''),
                ('SelfLibrary', 'self library design', 'https://github.com/YashSharma27-dev/SelfLibrary', 'CSS'),
                ('TicTacToeGame', '', 'https://github.com/YashSharma27-dev/TicTacToeGame', 'CSS'),
                ('RockPaperScissorGame', '', 'https://github.com/YashSharma27-dev/RockPaperScissorGame', 'JavaScript'),
                ('PasswordGenerator', '', 'https://github.com/YashSharma27-dev/PasswordGenerator', 'HTML'),
                ('whatsappClone', '', 'https://github.com/YashSharma27-dev/whatsappClone', 'CSS'),
                ('LayersClone', 'the website is desing clone of the layers webiste front page....', 'https://github.com/YashSharma27-dev/LayersClone', 'HTML'),
                ('PaytmClone', 'a responsive desingn paytm', 'https://github.com/YashSharma27-dev/PaytmClone', 'HTML'),
                ('javascript-exercises', '', 'https://github.com/YashSharma27-dev/javascript-exercises', 'JavaScript');

                INSERT INTO education (institution, degree, year) VALUES 
                ('National Institute of Technology (NIT), Delhi', 'Bachelor of Technology in Computer Science and Engineering', '2023 - Present'),
                ('Rajkiya Pratibha Vikas Vidhalaya, Gandhi Nagar, Delhi', 'Class XII - Secured 93% in CBSE Board Examinations', '2020-2022'),
                ('Rajkiya Sarvodaya Bal Vidyalaya, Gandhi Nagar, Delhi', 'Class X - Secured 88% in CBSE Board Examinations', '2020');

                INSERT INTO work (company, role, duration, description) VALUES 
                ('Home Tutor', 'Tutor', 'Jan 2024 - Present', 'Teaching high school Math and Science to 3+ students.');

                INSERT INTO achievements (title, description) VALUES
                ('LeetCode', 'Solved 100+ coding problems, demonstrating strong problem-solving skills in Data Structures and Algorithms'),
                ('Smart Code Web 1.0 Hackathon', 'Participated in Smart Code Web 1.0 Hackathon, gaining hands-on experience in web development and collaborative problem-solving.');

                INSERT INTO certifications (title, issuer, status) VALUES
                ('IBM AI Engineering Professional Certificate', 'Coursera', 'In Progress');
            `;
            db.exec(seedQuery, (err) => {
                if (err) console.error('Error seeding data:', err.message);
                else console.log('Data seeded successfully.');
            });
        }
    });
}

module.exports = db;
