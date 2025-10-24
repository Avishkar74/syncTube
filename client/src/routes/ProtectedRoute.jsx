import { Navigate } from 'react-router-dom';

// Minimal guard placeholder. Replace with real auth/room checks.
export default function ProtectedRoute({ children }) {
  const isAllowed = true; // TODO: read from store/auth
  if (!isAllowed) return <Navigate to="/" replace />;
  return children;
}
