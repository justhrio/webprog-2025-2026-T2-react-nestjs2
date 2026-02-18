import { useEffect, useState } from 'react';
import './App.css'; // Import the specific styles for this component

// Uses your backend URL (Codespace or Localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/guestbook';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    
    setIsLoading(true);
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', message: '' });
    await load();
    setIsLoading(false);
  };

  const remove = async (id) => {
    if(!confirm("Delete this message?")) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container">
      {/* Profile Header */}
      <header className="profile-section">
        <div className="profile-pic">
          {/* Generates a cool avatar based on the name "Dev" */}
          <img src="https://ui-avatars.com/api/?name=Dev&background=6366f1&color=fff&size=128&bold=true" alt="Profile" />
        </div>
        <div className="profile-info">
          <h1>My Developer Portfolio</h1>
          <p className="bio">
            Student Developer building full-stack apps with <strong>React</strong>, <strong>NestJS</strong>, and <strong>Supabase</strong>.
          </p>
          <div className="links">
            <a href="#" className="link-btn">GitHub</a>
            <a href="#" className="link-btn">LinkedIn</a>
          </div>
        </div>
      </header>

      {/* Guestbook Section */}
      <main className="guestbook-section">
        <h2>✍️ Sign my Guestbook</h2>
        
        <form onSubmit={save} className="guestbook-form">
          <input 
            placeholder="Your Name" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Leave a nice message..." 
            value={form.message} 
            onChange={e => setForm({...form, message: e.target.value})} 
            required 
            rows="3"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Sign Guestbook'}
          </button>
        </form>

        <div className="entries-list">
          {entries.length === 0 && <p className="empty-state">No messages yet. Be the first!</p>}
          
          {entries.map(e => (
            <div key={e.id} className="entry-card">
              <div className="entry-header">
                <span className="name">{e.name}</span>
                <span className="date">{new Date(e.created_at).toLocaleDateString()}</span>
              </div>
              <p className="message">{e.message}</p>
              <button onClick={() => remove(e.id)} className="delete-btn" title="Delete">🗑️</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}