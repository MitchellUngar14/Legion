import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

import Events from './pages/Events';
import FoodService from './pages/FoodService';
import BranchInfo from './pages/BranchInfo';
// Branch Sub-pages
import Executive from './pages/branch/Executive';
import Membership from './pages/branch/Membership';
import Resources from './pages/branch/Resources';
import Sports from './pages/branch/Sports';
import Rentals from './pages/branch/Rentals';

import PoppyRemembrance from './pages/PoppyRemembrance';
import Contact from './pages/Contact';
import ManageEvents from './pages/ManageEvents';
import ManageFood from './pages/ManageFood';
import ManageExecutive from './pages/ManageExecutive';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/branch-info" element={<BranchInfo />}>
              <Route path="executive" element={<Executive />} />
              <Route path="membership" element={<Membership />} />
              <Route path="resources" element={<Resources />} />
              <Route path="sports" element={<Sports />} />
              <Route path="rentals" element={<Rentals />} />
            </Route>
            <Route path="/poppy-remembrance" element={<PoppyRemembrance />} />
            <Route path="/events" element={<Events />} />
            <Route path="/food-service" element={<FoodService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/admin/events" element={
              <RequireAuth>
                <ManageEvents />
              </RequireAuth>
            } />
            <Route path="/admin/food" element={
              <RequireAuth>
                <ManageFood />
              </RequireAuth>
            } />
            <Route path="/admin/executive" element={
              <RequireAuth>
                <ManageExecutive />
              </RequireAuth>
            } />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
