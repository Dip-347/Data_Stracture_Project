import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Students } from './pages/admin/Students';
import { Contacts } from './pages/admin/Contacts';
import { Books } from './pages/admin/Books';
import { AdminLayout } from './components/layout/AdminLayout';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              {/* Future Dashboard Route will go here */}
              <Route path="/dashboard" element={<AdminDashboard />} />
              
              <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Phase 4 & 5 Routes */}
                  <Route path="students" element={<Students />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="books" element={<Books />} />
                  
                  {/* Future admin sub-routes */}
                  <Route path="transactions" element={<div className="p-8">Transactions Page (WIP)</div>} />
                  <Route path="reports" element={<div className="p-8">Reports Page (WIP)</div>} />
                  <Route path="settings" element={<div className="p-8">Settings Page (WIP)</div>} />
              </Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
