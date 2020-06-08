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
test('deletes tabgroup correctly', () => {
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
test('edits tabgroup correctly', () => {
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

  const { getByRole, getByTestId } = render(<Menu />);

  // expect tabgroup name to be 'Test'
  let tabgroup = getByTestId('tab-group');
  expect(tabgroup).toHaveTextContent('Test');

  // click edit button and press Enter key without changing name
  const editButton = getByTestId('edit-button');
  fireEvent.click(editButton);
  let input = getByRole('textbox');
  fireEvent.keyPress(input, { key: 'a', code: 65, charCode: 65 });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to still be 'Test'
  tabgroup = getByTestId('tab-group');
  expect(tabgroup).toHaveTextContent('Test');

  // click edit button and change name to 'Test'
  fireEvent.click(editButton);
  input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Test' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to still be 'Test'
  tabgroup = getByTestId('tab-group');
  expect(tabgroup).toHaveTextContent('Test');

  // click edit button and change name to 'Edited'
  fireEvent.click(editButton);
  input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Edited' } });
  fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

  // expect tabgroup name to have changed to 'Edited'
  tabgroup = getByTestId('tab-group');
  expect(tabgroup).toHaveTextContent('Edited');
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

  // expect tabgroup name to have changed to 'Test (1)'
  const after = queryAllByTestId('tab-group')[1];
  expect(after).toHaveTextContent('Test (1)');
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
test('adds tabgroup correctly', () => {
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
  expect(after[1]).toHaveTextContent('Untitled (1)');
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

// Test 11
test('deletes tab from tabgroup correctly', () => {
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'Test',
        tabs: [{ title: 'test', url: 'https://www.test.com' }],
      },
    ],
  });

  const { queryByText, getByTestId } = render(<Menu />);

  // expect to see tab in tabgroup
  expect(queryByText('test')).toBeInTheDocument();

  // click close button
  fireEvent.click(getByTestId('close-button'));

  // expect to not see tab in tabgroup
  expect(queryByText('test')).not.toBeInTheDocument();
});

// Test 12
test('drags and drops tab between tabgroups correctly', () => {
  // add two tabgroups to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'TestA',
        trackid: 'TestA',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com', stored: 'TestA' },
          { title: 'test2', url: 'https://www.test2.com', stored: 'TestA' },
        ],
      },
      {
        name: 'TestB',
        trackid: 'TestB',
        tabs: [],
      },
    ],
  });

  const { getByText, queryAllByTestId } = render(<Menu />);

  // drag-and-drop endpoints
  const start = queryAllByTestId('tab-group')[0];
  const end = queryAllByTestId('tab-group')[1];

  // expect first tabgroup to have tab to drag-and-drop
  let tab = getByText('test1');
  expect(start).toContainElement(tab);
  expect(end).not.toContainElement(tab);

  // tab's data
  const tabData = {
    title: 'test1',
    url: 'https://www.test1.com',
    stored: 'TestA',
  };

  // create a stub of Event.dataTransfer.getData() and just return tab 'test1'
  const getData = jest.fn(() => {
    return JSON.stringify(tabData);
  });

  // drop tab data into tabgroup
  fireEvent.dragOver(start);
  fireEvent.drop(end, {
    dataTransfer: { getData },
  });

  // expect getData() to have been called
  expect(getData).toHaveBeenCalled();

  // expect other tabgroup to have tab now
  tab = getByText('test1');
  expect(start).not.toContainElement(tab);
  expect(end).toContainElement(tab);
});

// Test 13
test('prevents dropping duplicate tab to tabgroup', () => {
  // add two tabgroups to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'TestA',
        trackid: 'TestA',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com', stored: 'TestA' },
        ],
      },
      {
        name: 'TestB',
        trackid: 'TestB',
        tabs: [
          { title: 'test2', url: 'https://www.test1.com', stored: 'TestA' },
        ],
      },
    ],
  });

  const { getByText, queryAllByTestId } = render(<Menu />);

  // drag-and-drop endpoints
  const start = queryAllByTestId('tab-group')[0];
  const end = queryAllByTestId('tab-group')[1];

  // expect first tabgroup to have tab to drag-and-drop
  let tab = getByText('test1');
  expect(start).toContainElement(tab);
  expect(end).not.toContainElement(tab);

  // tab's data
  const tabData = {
    title: 'test1',
    url: 'https://www.test1.com',
    stored: 'TestA',
  };

  // create a stub of Event.dataTransfer.getData() and just return tab 'test1'
  const getData = jest.fn(() => {
    return JSON.stringify(tabData);
  });

  // drop tab data into tabgroup
  fireEvent.dragOver(start);
  fireEvent.drop(end, {
    dataTransfer: { getData },
  });

  // expect getData() to have been called
  expect(getData).toHaveBeenCalled();

  // expect tab to not have transferred
  tab = getByText('test1');
  expect(start).toContainElement(tab);
  expect(end).not.toContainElement(tab);
});

// Test 14
test('prevents dropping tab in Active Tabs', () => {
  // add two tabgroups to chrome storage
  chrome.storage.sync.set({
    tabGroups: [
      {
        name: 'TestA',
        trackid: 'TestA',
        tabs: [
          { title: 'test1', url: 'https://www.test1.com', stored: 'TestA' },
        ],
      },
    ],
  });

  const { getByText, getByTestId } = render(<Menu />);

  // drag-and-drop endpoints
  const start = getByTestId('tab-group');
  const end = getByTestId('active-tabs');

  // expect tabgroup to have tab to drag-and-drop
  let tab = getByText('test1');
  expect(start).toContainElement(tab);
  expect(end).not.toContainElement(tab);

  // tab's data
  const tabData = {
    title: 'test1',
    url: 'https://www.test1.com',
    stored: 'TestA',
  };

  // create a stub of Event.dataTransfer.getData() and just return tab 'test1'
  const getData = jest.fn(() => {
    return JSON.stringify(tabData);
  });

  // drop tab data into tabgroup
  fireEvent.drop(end, {
    dataTransfer: { getData },
  });

  // expect getData() to not have been called
  expect(getData).not.toHaveBeenCalled();

  // expect tab to not have transferred
  tab = getByText('test1');
  expect(start).toContainElement(tab);
  expect(end).not.toContainElement(tab);
});
