import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabGroup from '../src/components/TabGroup';

// Test 1
test('renders without crashing', () => {
  const tabslist = [
    { name: 'test1', url: 'test1url' },
    { name: 'test2', url: 'test2url' },
  ];

  const div = document.createElement('div');
  ReactDOM.render(<TabGroup name="testgroup" tabs={tabslist} />, div);
});

// Test 2
test('renders tab group correctly in menu view', () => {
  const tabslist = [
    { name: 'test1', url: 'test1url' },
    { name: 'test2', url: 'test2url' },
  ];

  const { getByText, getByTestId, getAllByTestId } = render(
    <TabGroup name="testgroup" tabs={tabslist} view="menu" />
  );

  expect(getByText('testgroup')).toBeInTheDocument();

  expect(getByTestId('delete-button')).toBeInTheDocument();
  expect(getByTestId('edit-button')).toBeInTheDocument();

  const tabs = getAllByTestId('tab-button');
  expect(tabs.length).toEqual(2);
});

// Test 3
test('renders tab group correctly in focus view', () => {
  const tabslist = [
    { title: 'test1', url: 'test1url' },
    { title: 'test2', url: 'test2url' },
  ];

  const { getByText, getByTestId } = render(
    <TabGroup name="testgroup" tabs={tabslist} view="focus" />
  );

  expect(getByText('testgroup')).toBeInTheDocument();

  expect(getByTestId('focus-button')).toBeInTheDocument();
});
