import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Popup from '../src/components/Popup';

// Test 1
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Popup />, div);
});

// Test 2
test('renders popup correctly', () => {
  const { getByRole, getAllByTestId } = render(<Popup />);

  const groups = getAllByTestId('tab-group');
  expect(groups.length).toEqual(2);

  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  expect(menuButton).toBeInTheDocument();
});

// Test 3
test('deletes tab group correctly', () => {
  const { getAllByTestId } = render(<Popup />);

  const before = getAllByTestId('tab-group');
  expect(before.length).toEqual(2);

  const deleteButton = getAllByTestId('delete-button')[0];
  fireEvent.click(deleteButton);

  const after = getAllByTestId('tab-group');
  expect(after.length).toEqual(1);
});

// Test 4
test('edits tab group correctly', () => {
  const { getByRole, getAllByTestId } = render(<Popup />);

  const before = getAllByTestId('tab-group')[0];
  expect(before).toHaveTextContent('work');

  const editButton = getAllByTestId('edit-button')[0];
  fireEvent.click(editButton);

  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  const after = getAllByTestId('tab-group')[0];
  expect(after).toHaveTextContent('test');
});

// Test 5
test('opens menu page when button clicked', () => {
  const { getByRole } = render(<Popup />);

  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  fireEvent.click(menuButton);

  // using webextension-mock module, so no need to manually mock chrome methods
  expect(chrome.runtime.getURL).toHaveBeenCalledWith('menu.html');
  expect(chrome.tabs.create).toHaveReturned();
});
