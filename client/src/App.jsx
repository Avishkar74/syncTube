import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';

export default function App() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
