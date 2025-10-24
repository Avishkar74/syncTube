import { Outlet, Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>syncTube</Link>
        <nav style={{ display: 'flex', gap: 12 }}>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
