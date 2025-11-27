import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calorie calculator navigation', () => {
  render(<App />);
  const brandElement = screen.getByText(/Calorie Calculator/i);
  expect(brandElement).toBeInTheDocument();
});
