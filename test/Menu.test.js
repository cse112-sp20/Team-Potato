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
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com' },
          { title: 'test2', url: 'https://www.test2.com' },
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
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com' },
          { title: 'test2', url: 'https://www.test2.com' },
        ],
      },
    ],
  });

  const { getByTestId, queryAllByTestId } = render(<Menu />);

  // expect to see a single tabgroup
  const before = queryAllByTestId('tab-group');
  expect(before.length).toEqual(1);

  // click delete button
  const deleteButton = getByTestId('delete-button');
  fireEvent.click(deleteButton);

  // expect to see no tabgroups
  const after = queryAllByTestId('tab-group');
  expect(after.length).toEqual(0);
});

// Test 4
test('edits tab group correctly', () => {
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com' },
          { title: 'test2', url: 'https://www.test2.com' },
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

  // expect tabgroup name to still be 'Test'
  const middle = queryAllByTestId('tab-group')[0];
  expect(middle).toHaveTextContent('Test');

  // click edit button and change name to 'Edited'
  fireEvent.click(editButton);
  input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Edited' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to have changed to 'Edited'
  const after = queryAllByTestId('tab-group')[0];
  expect(after).toHaveTextContent('Edited');
});

// Test 5
test('prevents duplicate tabgroup names after edit', () => {
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        trackid: 'test1',
        tabs: [],
      },
      {
        name: 'Untitled',
        trackid: 'test2',
        tabs: [],
      },
    ],
  });

  const { getByRole, getAllByTestId, queryAllByTestId } = render(<Menu />);

  // click edit button and change name to 'Test'
  fireEvent.click(getAllByTestId('edit-button')[1]);
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Test' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to have changed to 'Test1'
  const after = queryAllByTestId('tab-group')[1];
  expect(after).toHaveTextContent('Test1');
});

// Test 6
test('renders Create Group modal correctly', () => {
  const { getByTestId } = render(<Menu />);

  // click Add Group button
  fireEvent.click(getByTestId('add-button'));

  // expect to see Create Group form
  const form = getByTestId('form');
  expect(form).toBeInTheDocument();
});

// Test 7
test('adds tab group correctly', () => {
  // start with no tabgroups in chrome storage
  chrome.storage.sync.set({
    tabGroups: [],
  });

  const { getByTestId, queryAllByTestId } = render(<Menu />);

  // expect to see no tabgroups
  const before = queryAllByTestId('tab-group');
  expect(before.length).toEqual(0);

  // click Add Group button
  fireEvent.click(getByTestId('add-button'));

  // submit form to create tabgroup
  const createGroup = getByTestId('form');
  fireEvent.change(createGroup, {
    target: [
      { value: 'Test' },
      {
        options: [
          { title: 'test1', url: 'https://www.test1.com', selected: true },
          { title: 'test2', url: 'https://www.test2.com' },
        ],
      },
    ],
  });
  fireEvent.submit(createGroup);

  // expect to see tabgroup
  const after = queryAllByTestId('tab-group');
  expect(after.length).toEqual(1);
  expect(after[0]).toHaveTextContent('Test');
});

// Test 8
test('prevents duplicate tabgroup names after creation', () => {
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Untitled',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com' },
          { title: 'test2', url: 'https://www.test2.com' },
        ],
      },
    ],
  });

  const { getByTestId, queryAllByTestId } = render(<Menu />);

  // click Add Group button
  fireEvent.click(getByTestId('add-button'));

  // submit form to create tabgroup
  const createGroup = getByTestId('form');
  fireEvent.change(createGroup, {
    target: [
      { value: '' },
      {
        options: [],
      },
    ],
  });
  fireEvent.submit(createGroup);

  // expect to see tabgroup
  const after = queryAllByTestId('tab-group');
  expect(after.length).toEqual(2);
  expect(after[1]).toHaveTextContent('Untitled1');
});

// Test 9
test('gets and opens saved tabs correctly', () => {
  // add saved tabs to chrome storage
  chrome.storage.sync.set({
    savedTabs: [{ title: 'test', url: 'https://www.test.com' }],
  });

  const { getByRole, queryByTestId } = render(<Menu />);

  // expect to see Saved Tabs section
  expect(queryByTestId('saved-tabs')).toBeInTheDocument();

  // click Open All button
  const openButton = getByRole('button', { name: 'Open All' });
  fireEvent.click(openButton);

  // expect tab with url 'https://www.test.com' to have been created
  expect(chrome.tabs.create).toHaveBeenCalledWith({
    url: 'https://www.test.com',
  });

  // expect to NOT see Saved Tabs sections
  expect(queryByTestId('saved-tabs')).not.toBeInTheDocument();
});

// Test 10
test('deletes saved tabs correctly', () => {
  // add saved tabs to chrome storage
  chrome.storage.sync.set({
    savedTabs: [{ title: 'test', url: 'https://www.test.com' }],
  });

  const { getByRole, queryByTestId } = render(<Menu />);

  // expect to see Saved Tabs section
  expect(queryByTestId('saved-tabs')).toBeInTheDocument();

  // click Delete All button
  const deleteButton = getByRole('button', { name: 'Delete All' });
  fireEvent.click(deleteButton);

  // expect to NOT see Saved Tabs sections
  expect(queryByTestId('saved-tabs')).not.toBeInTheDocument();
});
