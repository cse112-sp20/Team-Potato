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

  // expect tab to be named 'test'
  expect(getByRole('button')).toHaveTextContent('test');
});

// Test 3
test('open menu when tab is clicked', () => {
  // mock window.open(), so we can analyze its inputs/outputs
  window.open = jest.fn();

  const { getByRole } = render(<Tab title="test" url="testurl" />);

  // click Open Menu button
  fireEvent.click(getByRole('button'));

  // expect window.open() to have been called with url of 'testurl'
  expect(window.open).toHaveBeenCalledWith('testurl', '_blank');
});
