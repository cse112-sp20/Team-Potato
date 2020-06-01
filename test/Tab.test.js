import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Tab from '../src/components/Tab';

afterEach(cleanup);

// Test 1
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tab title="test" url="https://www.test.com" />, div);
  ReactDOM.render(<Tab title="test" url="ftp://test" />, div);
  ReactDOM.render(<Tab title="test" url="https://test.com" />, div);
});

// Test 2
test('renders tab correctly', () => {
  const { getByRole } = render(<Tab title="test" url="https://www.test.com" />);

  // expect tab to be named 'test'
  expect(getByRole('button')).toHaveTextContent('test');
});

// Test 3
test('opens menu when tab is clicked', () => {
  // mock window.open(), so we can analyze its inputs/outputs
  window.open = jest.fn();

  const { getByRole } = render(<Tab title="test" url="https://www.test.com" />);

  // click on tab
  fireEvent.click(getByRole('button'));

  // expect new tab with url of 'https://www.test.com' to have opened
  expect(window.open).toHaveBeenCalledWith('https://www.test.com', '_blank');
});

// Test 4
test('', () => {
  // create a mock of the Event.dataTransfer.setData() method
  const setData = jest.fn();

  const { getByRole } = render(<Tab title="test" url="https://www.test.com" />);

  // start draggging tab
  const tab = getByRole('button');
  fireEvent.dragStart(tab, {
    dataTransfer: { setData },
  });

  // expect Event.dataTransfer.setData() to have been called
  expect(setData).toHaveBeenCalled();
});
