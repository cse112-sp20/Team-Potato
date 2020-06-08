import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabGroup from '../src/components/TabGroup';

// Test 1
test('renders without crashing', () => {
  // tabs to put into tabgroup
  const tabslist = [
    { name: 'test1', url: 'https://www.test1.com' },
    { name: 'test2', url: 'https://www.test2.com' },
  ];

  const div = document.createElement('div');
  ReactDOM.render(<TabGroup name="Test" tabs={tabslist} />, div);
});

// Test 2
test('renders tab group correctly in menu view', () => {
  // tabs to put into tabgroup
  const tabslist = [
    { name: 'test1', url: 'https://www.test1.com' },
    { name: 'test2', url: 'https://www.test2.com' },
  ];

  const { getByText, getByTestId, getAllByTestId } = render(
    <TabGroup name="Test" tabs={tabslist} view="menu" />
  );

  // expect to see tabgroup
  expect(getByText('Test')).toBeInTheDocument();

  // expect to see delete and edit buttons
  expect(getByTestId('delete-button')).toBeInTheDocument();
  expect(getByTestId('edit-button')).toBeInTheDocument();

  // expect to see 2 tabs in tabgroup
  const tabs = getAllByTestId('tab-title');
  expect(tabs.length).toEqual(2);
});

// Test 3
test('renders tab group correctly in focus view', () => {
  // tabs to put into tabgroup
  const tabslist = [
    { title: 'test1', url: 'https://www.test1.com' },
    { title: 'test2', url: 'https://www.test2.com' },
  ];

  const { getByText, getByTestId } = render(
    <TabGroup name="Test" tabs={tabslist} view="focus" />
  );

  // expect to see tabgroup
  expect(getByText('Test')).toBeInTheDocument();

  // expect to see focus button
  expect(getByTestId('focus-button')).toBeInTheDocument();

  // click Open Menu button
  fireEvent.click(getByTestId('focus-button'));
});
