# Calorie Calculator Demo

A React-based demo website for calculating calories with role-based access for Suppliers, Nutritionists, and Restaurants.

## Features

### Three Roles

1. **Supplier** - Add new ingredients for approval
2. **Nutritionist** - Review and approve/reject ingredient submissions
3. **Restaurant** - Create foods using approved ingredients and calculate nutritional values

### Ingredient Properties

Each ingredient contains:
- Ingredient Name
- Category (Vegetables, Fruits, Meat, Dairy, Grains, Oils, Spices, Other)
- Calories (per 100g)
- Protein (g per 100g)
- Carbs (g per 100g)
- Fats (g per 100g)
- Status (pending, approved, rejected)

### Local Storage

All data is stored locally in the browser using localStorage.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Usage Workflow

1. **Supplier**: Add ingredients with nutritional information
2. **Nutritionist**: Review pending ingredients and approve/reject them
3. **Restaurant**: Create foods by selecting approved ingredients and specifying quantities

## Tech Stack

- React 18 with TypeScript
- React Router v7 for navigation
- localStorage for data persistence
- CSS for styling
