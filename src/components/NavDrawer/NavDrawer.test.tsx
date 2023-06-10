import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavDrawer from './NavDrawer';

describe('<NavDrawer />', () => {
  test('it should mount', () => {
    render(<NavDrawer />);
    
    const navDrawer = screen.getByTestId('NavDrawer');

    expect(navDrawer).toBeInTheDocument();
  });
});