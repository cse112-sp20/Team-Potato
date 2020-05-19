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

  const tabgroups = getAllByTestId('tab-group');
  expect(tabgroups.length).toEqual(2);

  const button = getByTestId('add-button');
  expect(button).toBeInTheDocument();
});

// Test 3
test('deletes tab group correctly', () => {
  const { getAllByTestId } = render(<Menu />);

  const deleteButton = getAllByTestId('delete-button')[0];
  fireEvent.click(deleteButton);

  const tabgroups = getAllByTestId('tab-group');
  expect(tabgroups.length).toEqual(1);
});

// Test 4
test('edits tab group correctly', () => {
  const { getByRole, getAllByTestId } = render(<Menu />);

  const group = getAllByTestId('tab-group')[0];
  expect(group).toHaveTextContent('work');

  const editButton = getAllByTestId('edit-button')[0];
  fireEvent.click(editButton);

  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  const edited = getAllByTestId('tab-group')[0];
  expect(edited).toHaveTextContent('test');
});

// Test 5
test('adds tab group correctly', () => {
  const { getByText, getByTestId, getAllByTestId } = render(<Menu />);

  const tabgroups = getAllByTestId('tab-group');
  expect(tabgroups.length).toEqual(2);

  const addButton = getByTestId('add-button');
  fireEvent.click(addButton);
  expect(getByText('Create a New Tabgroup')).toBeInTheDocument();

  // TODO
});
