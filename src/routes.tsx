import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import CreateMember from './pages/CreateMember';
import Admin from './pages/Admin';
import Reports from './pages/Reports';
import CompanyPartiesList from './pages/admin/CompanyPartiesList';
import CompanyPartyForm from './pages/admin/CompanyPartyForm';
import CompanyPartyDetail from './pages/CompanyPartyDetail';
import Profile from './pages/player/Profile';
import { EditProfile } from './pages/player/EditProfile';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
  // Members routes
  {
    path: '/members',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <Members />
      </ProtectedRoute>
    ),
  },
  {
    path: '/members/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CreateMember />
      </ProtectedRoute>
    ),
  },
  {
    path: '/members/:id',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <MemberDetail />
      </ProtectedRoute>
    ),
  },
  // Company Parties routes
  {
    path: '/company-parties',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartiesList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/company-parties/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartyForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/company-parties/:id/edit',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartyForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/company-parties/:id',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartyDetail />
      </ProtectedRoute>
    ),
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/company-parties',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartiesList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/company-parties/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartyForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/company-parties/:id/edit',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CompanyPartyForm />
      </ProtectedRoute>
    ),
  },
  // Reports routes
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <Reports />
      </ProtectedRoute>
    ),
  },
  // Unauthorized page
  {
    path: '/unauthorized',
    element: (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    ),
  },
]);
