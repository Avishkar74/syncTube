import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      {/* flex-1 ensures the main area grows to fill the viewport; min-h-0 prevents grid children from overflowing */}
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
