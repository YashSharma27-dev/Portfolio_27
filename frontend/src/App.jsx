import { useState, useEffect } from 'react';
import * as api from './api';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [work, setWork] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, workRes, healthRes] = await Promise.all([
          api.getProfile(),
          api.getProjects(),
          api.getSkills(),
          api.getWork(),
          api.checkHealth()
        ]);

        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
        setWork(workRes.data);
        setHealth(healthRes.data.status);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setHealth('error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length > 2) {
      const res = await api.search(q);
      setSearchResults(res.data);
    } else {
      setSearchResults(null);
    }
  };

  const filterBySkill = async (skillName) => {
    setSearchQuery(`Skill: ${skillName}`);
    const res = await api.getProjects(skillName);
    setSearchResults({ projects: res.data, skills: [] }); // formatting to match search result structure or just overriding view
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="header"><div className="skeleton" style={{ width: '200px', height: '40px' }} /></div>
        <div className="skeleton" style={{ width: '100%', height: '200px', marginBottom: '2rem' }} />
        <div className="grid">
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '150px' }} />)}
        </div>
      </div>
    );
  }

  const displayProjects = searchResults?.projects || projects;

  return (
    <div className="App">
      <header className="header">
        <div className="container nav">
          <div className="logo">Me-API Playground <span style={{ fontSize: '0.5em', color: 'var(--text-secondary)' }}>v1.0</span></div>
          <div className={`status-badge ${health === 'ok' ? '' : 'error'}`}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
            API: {health === 'ok' ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>

      <main className="container main-content">
        {/* Profile Section */}
        {profile && (
          <section className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, var(--card-bg), #1e293b)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1>{profile.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{profile.bio}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                  {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
                  {profile.resume && <a href={profile.resume} className="btn btn-primary" target="_blank" rel="noreferrer">Resume</a>}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Search */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search projects or skills..."
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Skills Section */}
        {(!searchResults || searchResults.skills?.length > 0) && (
          <>
            <div className="section-title"><h3>Skills</h3></div>
            <div style={{ marginBottom: '3rem' }}>
              {(searchResults?.skills || skills).map(skill => (
                <span key={skill.id} className="tag" onClick={() => filterBySkill(skill.name)} style={{ cursor: 'pointer' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Projects Section */}
        <div className="section-title"><h3>Projects</h3></div>
        <div className="grid">
          {displayProjects.map(proj => (
            <div key={proj.id} className="card">
              <h4>{proj.title}</h4>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{proj.description}</p>
              {proj.skills_used && (
                <div style={{ marginBottom: '1rem' }}>
                  {proj.skills_used.split(',').map((s, i) => (
                    <span key={i} className="tag" style={{ fontSize: '0.75rem' }}>{s.trim()}</span>
                  ))}
                </div>
              )}
              {proj.link && <a href={proj.link} target="_blank" rel="noreferrer">View Project →</a>}
            </div>
          ))}
          {displayProjects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects found.</p>}
        </div>

        {/* Work Section */}
        {!searchResults && (
          <>
            <div className="section-title"><h3>Experience</h3></div>
            <div className="grid">
              {work.map((job, i) => (
                <div key={job.id || i} className="card">
                  <h4>{job.role}</h4>
                  <div style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{job.company}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{job.duration}</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default App;
