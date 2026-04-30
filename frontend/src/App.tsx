import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import Categories from './pages/Categories';
import AddCategory from './pages/AddCategory';
import EditCategory from './pages/EditCategory';
import Suppliers from './pages/Suppliers';
import AddSupplier from './pages/AddSupplier';
import EditSupplier from './pages/EditSupplier';
import PurchaseOrders from './pages/PurchaseOrders';
import ViewPurchaseOrder from './pages/ViewPurchaseOrder';
import AddPurchaseOrder from './pages/AddPurchaseOrder';
import EditPurchaseOrder from './pages/EditPurchaseOrder';
import Requisitions from './pages/Requisitions';
import ViewRequisition from './pages/ViewRequisition';
import AddRequisition from './pages/AddRequisition';
import EditRequisition from './pages/EditRequisition';
import StockIn from './pages/StockIn';
import AddStockIn from './pages/AddStockIn';
import ViewStockIn from './pages/ViewStockIn';
import StockOut from './pages/StockOut';
import AddStockOut from './pages/AddStockOut';
import ViewStockOut from './pages/ViewStockOut';
import StockRequests from './pages/StockRequests';
import AddStockRequest from './pages/AddStockRequest';
import ViewStockRequest from './pages/ViewStockRequest';
import EditStockRequest from './pages/EditStockRequest';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import EditDepartment from './pages/EditDepartment';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import MyProfile from './pages/MyProfile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';
import UserGuide from './pages/UserGuide';
import VideoTutorials from './pages/VideoTutorials';
import ApiDocs from './pages/ApiDocs';
import ReleaseNotes from './pages/ReleaseNotes';
import PredictiveAnalysis from './pages/PredictiveAnalysis';
import ComingSoon from './pages/ComingSoon';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/inventory/add"
        element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/inventory/:id/edit"
        element={
          <ProtectedRoute>
            <EditItem />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/purchase-orders"
        element={
          <ProtectedRoute>
            <PurchaseOrders />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/purchase-orders/create"
        element={
          <ProtectedRoute>
            <AddPurchaseOrder />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/purchase-orders/:id"
        element={
          <ProtectedRoute>
            <ViewPurchaseOrder />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/purchase-orders/:id/edit"
        element={
          <ProtectedRoute>
            <EditPurchaseOrder />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/requisitions"
        element={
          <ProtectedRoute>
            <Requisitions />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/requisitions/create"
        element={
          <ProtectedRoute>
            <AddRequisition />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/requisitions/:id"
        element={
          <ProtectedRoute>
            <ViewRequisition />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/requisitions/:id/edit"
        element={
          <ProtectedRoute>
            <EditRequisition />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-in"
        element={
          <ProtectedRoute>
            <StockIn />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-in/create"
        element={
          <ProtectedRoute>
            <AddStockIn />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-in/:id"
        element={
          <ProtectedRoute>
            <ViewStockIn />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stock-out"
        element={
          <ProtectedRoute>
            <StockOut />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stock-out/create"
        element={
          <ProtectedRoute>
            <AddStockOut />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stock-out/:id"
        element={
          <ProtectedRoute>
            <ViewStockOut />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/suppliers"
        element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/suppliers/create"
        element={
          <ProtectedRoute>
            <AddSupplier />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/suppliers/:id/edit"
        element={
          <ProtectedRoute>
            <EditSupplier />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/categories/create"
        element={
          <ProtectedRoute>
            <AddCategory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/categories/:id/edit"
        element={
          <ProtectedRoute>
            <EditCategory />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/departments/create"
        element={
          <ProtectedRoute>
            <AddDepartment />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/departments/:id/edit"
        element={
          <ProtectedRoute>
            <EditDepartment />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute>
            <AddUser />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/users/:id/edit"
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-requests"
        element={
          <ProtectedRoute>
            <StockRequests />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-requests/create"
        element={
          <ProtectedRoute>
            <AddStockRequest />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-requests/:id"
        element={
          <ProtectedRoute>
            <ViewStockRequest />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/stock-requests/:id/edit"
        element={
          <ProtectedRoute>
            <EditStockRequest />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/predictive-dashboard"
        element={
          <ProtectedRoute>
            <PredictiveAnalysis />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpSupport />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help/user-guide"
        element={
          <ProtectedRoute>
            <UserGuide />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help/tutorials"
        element={
          <ProtectedRoute>
            <VideoTutorials />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help/api-docs"
        element={
          <ProtectedRoute>
            <ApiDocs />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/help/release-notes"
        element={
          <ProtectedRoute>
            <ReleaseNotes />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
