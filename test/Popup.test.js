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
  chrome.storage.sync.set({
    shouldDisplayFocusMode: false,
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

  const { getByRole, getAllByTestId } = render(<Popup />);

  expect(chrome.storage.sync.get).toHaveBeenCalled();

  const tabGroups = getAllByTestId('tab-group');
  expect(tabGroups.length).toEqual(1);

  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  expect(menuButton).toBeInTheDocument();
});

// Test 3
test('displays focus mode popup when focus button clicked', () => {
  chrome.storage.sync.set({
    shouldDisplayFocusMode: false,
  });

  const { getByRole, getByTestId } = render(<Popup />);

  const focusButton = getByTestId('focus-button');
  expect(focusButton).toBeInTheDocument();
  fireEvent.click(focusButton);

  const startFocusButton = getByRole('button', { name: 'Start\nFocus' });
  expect(startFocusButton).toBeInTheDocument();

  const goBackButton = getByRole('button', { name: 'Go Back' });
  expect(goBackButton).toBeInTheDocument();
});

test('displays popup when Go Back button clicked in focus mode popup', () => {
  chrome.storage.sync.set({
    shouldDisplayFocusMode: true,
  });

  const { getByRole } = render(<Popup />);

  const goBackButton = getByRole('button', { name: 'Go Back' });
  expect(goBackButton).toBeInTheDocument();
  fireEvent.click(goBackButton);
});

// Test 4
test('starts and ends focus mode correctly', () => {
  chrome.storage.sync.set({
    shouldDisplayFocusMode: true,
    focusedTabGroupName: 'Test',
    focusedTabGroupUrls: ['test1url', 'test2url'],
  });

  const { getByRole } = render(<Popup />);

  const startFocusButton = getByRole('button', { name: 'Start\nFocus' });
  expect(startFocusButton).toBeInTheDocument();
  fireEvent.click(startFocusButton);

  const endFocusButton = getByRole('button', { name: 'End\nFocus' });
  expect(endFocusButton).toBeInTheDocument();
  fireEvent.click(endFocusButton);
});

// Test 5
test('opens menu page when button clicked', () => {
  const { getByRole } = render(<Popup />);

  const menuButton = getByRole('button', { name: 'Open Potato Tab' });
  fireEvent.click(menuButton);

  expect(chrome.runtime.getURL).toHaveBeenCalledWith('menu.html');
  expect(chrome.tabs.create).toHaveReturned();
});
