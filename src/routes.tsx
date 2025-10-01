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
import ItemsList from './pages/admin/ItemsList';
import ItemForm from './pages/admin/ItemForm';
import ItemsView from './pages/ItemsView';
import DroppedItemsPage from './pages/DroppedItemsPage';
import RaidsList from './pages/RaidsList';
import RaidForm from './pages/RaidForm';
import RaidDetail from './pages/RaidDetail';
import RaidInstanceForm from './pages/RaidInstanceForm';
import RaidInstanceDetail from './pages/RaidInstanceDetail';
import RaidsDashboard from './pages/RaidsDashboard';
import DkpDashboard from './pages/DkpDashboard';
import DkpProfile from './pages/DkpProfile';
import DkpAdmin from './pages/DkpAdmin';
import AuctionCreate from './pages/AuctionCreate';
import AuctionsList from './pages/AuctionsList';
import AuctionDetail from './pages/AuctionDetail';
import AuctionActive from './pages/AuctionActive';
import MyWonItems from './pages/MyWonItems';
import AuctionedItemsManagement from './pages/AuctionedItemsManagement';
import AuctionAnalytics from './pages/AuctionAnalytics';
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
  {
    path: '/members',
    element: (
      <ProtectedRoute>
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
      <ProtectedRoute>
        <MemberDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/company-parties',
    element: (
      <ProtectedRoute>
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
      <ProtectedRoute>
        <CompanyPartyDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/items',
    element: (
      <ProtectedRoute>
        <ItemsView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dropped-items',
    element: (
      <ProtectedRoute>
        <DroppedItemsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids',
    element: (
      <ProtectedRoute>
        <RaidsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids/dashboard',
    element: (
      <ProtectedRoute>
        <RaidsDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <RaidForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids/:id',
    element: (
      <ProtectedRoute>
        <RaidDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids/:id/edit',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <RaidForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raids/:raidId/instances/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <RaidInstanceForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/raid-instances/:id',
    element: (
      <ProtectedRoute>
        <RaidInstanceDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dkp',
    element: (
      <ProtectedRoute>
        <DkpDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dkp/profile',
    element: (
      <ProtectedRoute>
        <DkpProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dkp/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <DkpAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions',
    element: (
      <ProtectedRoute>
        <AuctionsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/create',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AuctionCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/active',
    element: (
      <ProtectedRoute>
        <AuctionActive />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/my-won-items',
    element: (
      <ProtectedRoute>
        <MyWonItems />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/auctioned-items',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AuctionedItemsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/analytics',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AuctionAnalytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auctions/:id',
    element: (
      <ProtectedRoute>
        <AuctionDetail />
      </ProtectedRoute>
    ),
  },
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
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/items',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <ItemsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/items/new',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <ItemForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/items/:id/edit',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <ItemForm />
      </ProtectedRoute>
    ),
  },
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
