import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import SupplierPage from './components/Supplier/SupplierPage';
import NutritionistPage from './components/Nutritionist/NutritionistPage';
import RestaurantPage from './components/Restaurant/RestaurantPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/supplier" replace />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="/nutritionist" element={<NutritionistPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
