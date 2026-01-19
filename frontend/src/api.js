import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust if deployed

export const getProfile = () => axios.get(`${API_URL}/profile`);
export const getProjects = (skill) => axios.get(`${API_URL}/projects`, { params: { skill } });
export const getSkills = () => axios.get(`${API_URL}/skills`);
export const getWork = () => axios.get(`${API_URL}/work`);
export const search = (q) => axios.get(`${API_URL}/search`, { params: { q } });
export const checkHealth = () => axios.get(`${API_URL}/health`);
