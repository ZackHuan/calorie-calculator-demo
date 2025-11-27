import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
  const getLinkClasses = (isActive: boolean) => 
    `block text-white/85 no-underline px-6 py-5 font-medium transition-all border-b-[3px] border-transparent hover:bg-white/10 hover:text-white ${isActive ? 'bg-white/15 text-white !border-white' : ''}`;

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 flex justify-between items-center shadow-md">
      <div className="text-white text-xl font-semibold">
        <h1>🍎 Calorie Calculator</h1>
      </div>
      <ul className="flex list-none m-0 p-0 gap-1">
        <li>
          <NavLink 
            to="/supplier" 
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            📦 Supplier
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/nutritionist" 
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            🥗 Nutritionist
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/restaurant" 
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            🍽️ Restaurant
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
