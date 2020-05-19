import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Menu from '../src/components/Menu';

// Test 1
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Menu />, div);
});

// Test 2
test('renders menu correctly', () => {
  const { getByTestId, getAllByTestId } = render(<Menu />);

  // using webextension-mock module, so no need to manually mock chrome methods
  expect(chrome.tabs.query).toHaveBeenCalled();

  const groups = getAllByTestId('tab-group');
  expect(groups.length).toEqual(2);

  const addButton = getByTestId('add-button');
  expect(addButton).toBeInTheDocument();
});

// Test 3
test('deletes tab group correctly', () => {
  const { getAllByTestId } = render(<Menu />);

  const before = getAllByTestId('tab-group');
  expect(before.length).toEqual(2);

  const deleteButton = getAllByTestId('delete-button')[0];
  fireEvent.click(deleteButton);

  const after = getAllByTestId('tab-group');
  expect(after.length).toEqual(1);
});

// Test 4
test('edits tab group correctly', () => {
  const { getByRole, getAllByTestId } = render(<Menu />);

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
test('adds tab group correctly', () => {
  const { getByText, getByTestId, getAllByTestId } = render(<Menu />);

  const before = getAllByTestId('tab-group');
  expect(before.length).toEqual(2);

  fireEvent.click(getByTestId('add-button'));
  expect(getByText('Create a New Tabgroup')).toBeInTheDocument();

  // TODO
});
