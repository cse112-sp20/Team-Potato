import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Tab from '../src/components/Tab';

// Test 1
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tab title="test" url="testurl" />, div);
});

// Test 2
test('renders tab correctly', () => {
  const { getByRole } = render(<Tab title="test" url="testurl" />);

  const button = getByRole('button');
  expect(button).toHaveTextContent('test');
});

// Test 3
test('triggers onClick handler when tab is clicked', () => {
  window.open = jest.fn();

  const { getByRole } = render(<Tab title="test" url="testurl" />);

  fireEvent.click(getByRole('button'));
  expect(window.open).toHaveBeenCalledWith('testurl', '_blank');
  expect(window.open).not.toHaveReturnedWith(null);
});
