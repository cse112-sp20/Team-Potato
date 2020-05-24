import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Menu from '../src/components/Menu';

// Test 1
test('renders without crashing', () => {
  chrome.storage.sync.set({
    tabGroups: [],
  });

  const div = document.createElement('div');
  ReactDOM.render(<Menu />, div);
});

// Test 2
test('renders menu correctly', () => {
  // add a tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'test1url' },
          { title: 'test2', url: 'test2url' },
        ],
      },
    ],
  });

  const { getByTestId } = render(<Menu />);

  // expect query of active tabs to have occurred
  expect(chrome.tabs.query).toHaveBeenCalled();

  // expect to see tabgroup with name 'Test'
  const tabGroup = getByTestId('tab-group');
  expect(tabGroup).toHaveTextContent('Test');

  // expect to see Add Group button
  const addButton = getByTestId('add-button');
  expect(addButton).toBeInTheDocument();
});

// Test 3
test('deletes tab group correctly', () => {
  // add a tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'test1url' },
          { title: 'test2', url: 'test2url' },
        ],
      },
    ],
  });

  const { getByTestId, queryAllByTestId } = render(<Menu />);

  // expect to see a single tabgroup
  const before = queryAllByTestId('tab-group');
  expect(before.length).toEqual(1);

  // click delete button on that tabgroup
  const deleteButton = getByTestId('delete-button');
  fireEvent.click(deleteButton);

  // expect to see no tabgroups
  const after = queryAllByTestId('tab-group');
  expect(after.length).toEqual(0);
});

// Test 4
test('edits tab group correctly', () => {
  // add a tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'test1url' },
          { title: 'test2', url: 'test2url' },
        ],
      },
    ],
  });

  const { getByRole, getByTestId, queryAllByTestId } = render(<Menu />);

  // expect tabgroup name to be 'Test'
  const before = getByTestId('tab-group');
  expect(before).toHaveTextContent('Test');

  // click edit button and press Enter key without changing name
  const editButton = getByTestId('edit-button');
  fireEvent.click(editButton);
  let input = getByRole('textbox');
  fireEvent.keyPress(input, { key: 'a', code: 65, charCode: 65 });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to be 'Test'
  const middle = queryAllByTestId('tab-group')[0];
  expect(middle).toHaveTextContent('Test');

  // click edit button and change name to 'Edited'
  fireEvent.click(editButton);
  input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Edited' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to be 'Edited'
  const after = queryAllByTestId('tab-group')[0];
  expect(after).toHaveTextContent('Edited');
});

// Test 5
test('renders new group modal correctly', () => {
  const { getByRole, getByTestId } = render(<Menu />);

  fireEvent.click(getByTestId('add-button'));

  const createButton = getByRole('button', { name: 'Create Group' });
  expect(createButton).toBeInTheDocument();
});

// Test 5
test('adds tab group correctly', () => {
  chrome.storage.sync.set({
    tabGroups: [],
  });

  const { getByTestId, queryAllByTestId } = render(<Menu />);

  const before = queryAllByTestId('tab-group');
  expect(before.length).toEqual(0);

  fireEvent.click(getByTestId('add-button'));

  const createGroup = getByTestId('form');
  fireEvent.change(createGroup, {
    target: [
      { value: '' },
      {
        options: [
          { title: 'test1', url: 'test1url' },
          { title: 'test2', url: 'test2url' },
        ],
      },
    ],
  });
  fireEvent.submit(createGroup);
});
