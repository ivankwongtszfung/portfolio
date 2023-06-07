import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyTimeline from './MyTimeline';

describe('<MyTimeline />', () => {
  test('it should mount', () => {
    render(<MyTimeline />);
    
    const myTimeline = screen.getByTestId('MyTimeline');

    expect(myTimeline).toBeInTheDocument();
  });
});