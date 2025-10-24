import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Room from '../pages/Room';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Home />} />
          <Route
            path="/room/:id"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
