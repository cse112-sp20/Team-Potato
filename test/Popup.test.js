import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Popup from '../src/components/Popup';

// Test 1
test('renders without crashing', () => {
  chrome.storage.sync.set({
    tabGroups: [],
  });

  const div = document.createElement('div');
  ReactDOM.render(<Popup />, div);
});

// Test 2
test('renders popup correctly', () => {
  // add tabgroup to chrome storage
  chrome.storage.sync.set({
    shouldDisplayFocusMode: false,
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

  const { getByRole, getAllByTestId } = render(<Popup />);

  // expect to see tabgroup
  const tabGroups = getAllByTestId('tab-group');
  expect(tabGroups.length).toEqual(1);

  // expect to see Open Menu button
  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  expect(menuButton).toBeInTheDocument();
});

// Test 3
test('displays focus mode popup when focus button clicked', () => {
  // don't display focus mode initially
  chrome.storage.sync.set({
    shouldDisplayFocusMode: false,
  });

  const { getByRole, getByTestId } = render(<Popup />);

  // click focus button
  fireEvent.click(getByTestId('focus-button'));

  // expect to see Start Focus button
  const startFocusButton = getByRole('button', { name: 'Start\nFocus' });
  expect(startFocusButton).toBeInTheDocument();

  // expect to see Go Back button
  const goBackButton = getByRole('button', { name: 'Go Back' });
  expect(goBackButton).toBeInTheDocument();
});

// Test 4
test('displays popup when Go Back button clicked in focus mode popup', () => {
  // display focus mode initially
  chrome.storage.sync.set({
    shouldDisplayFocusMode: true,
  });

  const { getByRole, getByTestId } = render(<Popup />);

  // click Go Back Button
  const goBackButton = getByRole('button', { name: 'Go Back' });
  expect(goBackButton).toBeInTheDocument();
  fireEvent.click(goBackButton);

  // expect to see focus button
  expect(getByTestId('focus-button')).toBeInTheDocument();
});

// Test 5
test('starts and ends focus mode correctly', () => {
  // set focus tabgroup in chrome storage
  chrome.storage.sync.set({
    shouldDisplayFocusMode: true,
    focusedTabGroupName: 'Test',
    focusedTabGroupUrls: ['https://test1.com'],
  });

  const { getByRole } = render(<Popup />);

  // click Start Focus button
  const startFocusButton = getByRole('button', { name: 'Start\nFocus' });
  fireEvent.click(startFocusButton);

  // expect tab in tabgroup with url 'https://test1.com' to be created
  expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://test1.com' });

  // click End Focus button
  const endFocusButton = getByRole('button', { name: 'End\nFocus' });
  fireEvent.click(endFocusButton);

  // expect to see Start Focus button
  expect(startFocusButton).toBeInTheDocument();
});

// Test 6
test('opens menu page when button clicked', () => {
  const { getByRole } = render(<Popup />);

  // click Open Menu button
  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  fireEvent.click(menuButton);

  // expect menu page file to have been passed to getURL() method
  expect(chrome.runtime.getURL).toHaveBeenCalledWith('menu.html');

  // expect menu tab to have been created successfully
  expect(chrome.tabs.create).toHaveReturned();
});
