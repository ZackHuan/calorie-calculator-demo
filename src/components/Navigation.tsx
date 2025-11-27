import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <h1>🍎 Calorie Calculator</h1>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/supplier" className={({ isActive }) => isActive ? 'active' : ''}>
            📦 Supplier
          </NavLink>
        </li>
        <li>
          <NavLink to="/nutritionist" className={({ isActive }) => isActive ? 'active' : ''}>
            🥗 Nutritionist
          </NavLink>
        </li>
        <li>
          <NavLink to="/restaurant" className={({ isActive }) => isActive ? 'active' : ''}>
            🍽️ Restaurant
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
