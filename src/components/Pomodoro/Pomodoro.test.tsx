import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pomodoro from './Pomodoro';

describe('<Pomodoro />', () => {
  test('it should mount', () => {
    render(<Pomodoro />);
    
    const pomodoro = screen.getByTestId('Pomodoro');

    expect(pomodoro).toBeInTheDocument();
  });
});