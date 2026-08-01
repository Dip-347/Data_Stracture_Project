import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Students } from './pages/admin/Students';
import { Contacts } from './pages/admin/Contacts';
import { Books } from './pages/admin/Books';
import { Transactions } from './pages/admin/Transactions';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';
import { Requests } from './pages/admin/Requests';
import { AdminLayout } from './components/layout/AdminLayout';
import { StudentLayout } from './components/layout/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { BookBrowsing } from './pages/student/BookBrowsing';
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
                  {/* Phase 4, 5, 6 Routes */}
                  <Route path="students" element={<Students />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="books" element={<Books />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="transactions" element={<Transactions />} />
                  
                  {/* Phase 7 Polish Routes */}
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
              </Route>

              {/* Student Portal Routes (Phase 7) */}
              <Route path="/student" element={<StudentLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="books" element={<BookBrowsing />} />
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
