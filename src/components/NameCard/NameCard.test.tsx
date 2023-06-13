import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NameCard from './NameCard';

describe('<NameCard />', () => {
  test('it should mount', () => {
    render(<NameCard />);
    
    const nameCard = screen.getByTestId('NameCard');

    expect(nameCard).toBeInTheDocument();
  });
});